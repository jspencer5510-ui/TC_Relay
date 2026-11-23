// 📖 Docs: obsidian/architecture/tech-stack.md (three) · decisions-log.md ADR-0016 · ADR-0018
//
// "Mirror Hall" — the portfolio rotunda. A ring of curved image cards standing on a
// black reflective pool: drag to spin it (with inertia), hover to swell a card, and
// the pointer leaves an expanding ripple trail across the water. The pool is a true
// planar reflection (a mirrored camera rendered to a texture) distorted by those
// ripples, so the card imagery is the only light in the room and spills over the
// water as colour, never white.
//
// WebGL subsystem — it owns its renderer, shaders, composer and rAF loop, isolated
// from the spring engine (ADR-0002 governs DOM/UI motion; a canvas artwork runs its
// own loop). The loop is visibility-gated per ADR-0016. The React leaf
// (src/views/mirror-hall.tsx) mounts it, renders the DOM HUD above it, and disposes it.
//
// Ported from a fixed Three.js r0.143 spec, with four deliberate deviations, all to
// fit this project: (1) it fills its section instead of the viewport, so every screen
// measurement is taken from the canvas's parent rather than `innerWidth/innerHeight`;
// (2) card content arrives as an argument instead of a baked-in array (Data rules);
// (3) the spec's zero-count grass field and zero-strength UnrealBloomPass are dropped
// — both drew nothing but still cost frame time, and the perf ADR wins over keeping
// inert code. The gamma pass **stays**: custom `ShaderMaterial`s never get
// `renderer.outputEncoding` applied, so without it every card renders linear and dark;
// (4) ambient motion (auto-spin, camera drift, wave animation) is skipped under
// reduced motion, but the loop still runs so drag and hover stay usable.
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader.js";
import {
  CSS3DRenderer,
  CSS3DObject,
} from "three/examples/jsm/renderers/CSS3DRenderer.js";

/** One card on the ring: a texture and the title shown on its 3D label + in the HUD. */
export interface MirrorHallCard {
  image: string;
  title: string;
}

export interface MirrorHallOptions {
  /** Cards to hang on the ring; cycled to fill every slot. */
  cards: MirrorHallCard[];
  /** Skip ambient motion (auto-spin, camera drift, waves); drag/hover still work. */
  reducedMotion: boolean;
  /** Element the CSS3D label layer is appended to (positioned over the canvas). */
  labelLayer: HTMLElement;
  /** Fired when a different card rotates to front-and-centre. */
  onFocusChange?: (index: number) => void;
  /** Fired once, on the first drag — the leaf uses it to retire the "drag" hint. */
  onFirstDrag?: () => void;
}

export interface MirrorHallHandle {
  dispose: () => void;
}

// Fixed scene parameters. Unlike the plasma burst these are not live-tunable — the
// look is final, so they stay module-private rather than becoming a config prop.
const P = {
  bgColor: "#000000",
  skyTop: "#01002e", // near-black blue zenith — the only non-black in the room
  skyHorizon: "#000000",
  skyBottom: "#000000",
  // ring
  ringRadius: 8.5,
  cardW: 1.68,
  cardH: 2.74,
  cardCurve: 1, // 1 = fully bowed onto the ring cylinder
  cardGap: 0.36,
  cardLift: 0.05,
  cornerRadius: 0.035,
  hoverScale: 1.035,
  // labels
  labelSize: 15, // px, scaled to world units by CSS3D
  labelColor: "#d6d6d6",
  labelWeight: 500,
  labelTracking: 1, // px letter-spacing
  labelOffset: 0.2, // world units above the card top
  labelOpacity: 0.68,
  // motion
  fov: 67,
  camHeight: 2.02,
  autoSpin: 0.04, // rad/s idle drift
  dragSpeed: 0.0085, // rad per px dragged
  inertiaDamp: 0.89,
  // water
  waterDeep: "#000000",
  waterTint: "#000000",
  reflBright: 0.25,
  rippleScale: 0.68,
  rippleDistort: 0.1,
  waterGlint: 0.04,
  fresnelPow: 2.1,
} as const;

// Frame-cost budget. This section is the most expensive thing on the page — it draws
// the scene TWICE per frame (once mirrored into the reflection target, once for real)
// plus a full-screen gamma pass. At the spec's full-DPR settings that is ~15 Mpx of
// shading a frame, which pins a laptop GPU and can wedge the browser's GPU process.
// These three dials cut it by roughly an order of magnitude with no visible change,
// because the reflection is dim (0.25) and ripple-distorted before it is ever seen.
const MAX_DPR = 1.5; // canvas pixel-ratio cap (the artwork is dark and low-contrast)
const REFLECT_SCALE = 0.75; // reflection target size, as a fraction of CSS pixels — no DPR
const REFLECT_EVERY = 2; // refresh the reflection every Nth frame

const TRAIL_N = 14; // pointer ripple slots, cycled
const LABEL_SCALE = 0.008; // CSS px → world units for the 3D labels
const STAR_COUNT = 700;

const hexToVec3 = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return new THREE.Vector3(
    ((n >> 16) & 255) / 255,
    ((n >> 8) & 255) / 255,
    (n & 255) / 255,
  );
};

/** Bow a plane onto the ring cylinder so all cards together close a perfect circle. */
function curvedCardGeo(w: number, h: number, R: number, curve: number) {
  const g = new THREE.PlaneGeometry(w, h, 28, 1);
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const d = x / R;
    const cx = R * Math.sin(d);
    const cz = R * (1 - Math.cos(d));
    pos.setX(i, x + (cx - x) * curve);
    pos.setZ(i, cz * curve);
  }
  pos.needsUpdate = true;
  return g;
}

export function createMirrorHall(
  canvas: HTMLCanvasElement,
  { cards, reducedMotion, labelLayer, onFocusChange, onFirstDrag }: MirrorHallOptions,
): MirrorHallHandle {
  const parent = canvas.parentElement ?? canvas;
  const sizeOf = () => {
    const r = parent.getBoundingClientRect();
    return { w: Math.max(1, r.width), h: Math.max(1, r.height) };
  };
  let { w, h } = sizeOf();
  const dpr = Math.min(window.devicePixelRatio, MAX_DPR);

  // WebGL1: the card shader relies on the GL_OES_standard_derivatives extension for
  // its anti-aliased rounded-rect mask.
  const renderer = new THREE.WebGL1Renderer({ canvas, antialias: true });
  renderer.setPixelRatio(dpr);
  renderer.setSize(w, h, false);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(P.bgColor);

  // ── Sky ────────────────────────────────────────────────────────────────────
  const skyMat = new THREE.ShaderMaterial({
    uniforms: {
      uTop: { value: hexToVec3(P.skyTop) },
      uHorizon: { value: hexToVec3(P.skyHorizon) },
      uBottom: { value: hexToVec3(P.skyBottom) },
    },
    side: THREE.BackSide,
    depthWrite: false,
    vertexShader: `varying vec3 vP;
      void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`,
    fragmentShader: `precision highp float;
      uniform vec3 uTop, uHorizon, uBottom; varying vec3 vP;
      void main(){
        float h = normalize(vP).y;
        vec3 col = mix(uBottom, uHorizon, smoothstep(-0.25, 0.02, h));
        col = mix(col, uTop, smoothstep(0.02, 0.72, h));
        gl_FragColor = vec4(max(col, 0.0), 1.0);
      }`,
  });
  const skyGeo = new THREE.SphereGeometry(180, 32, 24);
  const sky = new THREE.Mesh(skyGeo, skyMat);
  sky.renderOrder = -1;
  scene.add(sky);

  const camera = new THREE.PerspectiveCamera(P.fov, w / h, 0.1, 220);
  camera.position.set(0, P.camHeight, 0.001); // at the ring's centre, looking out
  const lookTarget = new THREE.Vector3(0, 1.15, -P.ringRadius);
  camera.lookAt(lookTarget);

  // ── Starfield ──────────────────────────────────────────────────────────────
  // Deterministic hash-random so the sky is identical every load (and in the pool).
  const starPos = new Float32Array(STAR_COUNT * 3);
  {
    let seed = 1234.5;
    const rnd = () => {
      seed = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
      return seed - Math.floor(seed);
    };
    for (let i = 0; i < STAR_COUNT; i++) {
      const r = 70 + rnd() * 80;
      const th = rnd() * Math.PI * 2;
      const ph = (rnd() * 0.6 + 0.2) * Math.PI;
      starPos[i * 3] = Math.sin(ph) * Math.cos(th) * r;
      starPos[i * 3 + 1] = Math.abs(Math.cos(ph)) * r * 0.7 + 5;
      starPos[i * 3 + 2] = Math.sin(ph) * Math.sin(th) * r;
    }
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
  const starMat = new THREE.PointsMaterial({
    color: 0x6f8bb8,
    size: 0.16,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
  });
  scene.add(new THREE.Points(starGeo, starMat));

  // ── Cards ──────────────────────────────────────────────────────────────────
  const carousel = new THREE.Group();
  scene.add(carousel);
  const cardMeshes: THREE.Mesh[] = [];
  const cardMats: THREE.ShaderMaterial[] = [];
  const cardLabels: { el: HTMLDivElement; obj: CSS3DObject }[] = [];
  const textures: THREE.Texture[] = [];
  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  const loader = new THREE.TextureLoader();
  const texCache: Record<string, THREE.Texture> = {};

  const css3d = new CSS3DRenderer();
  const labelRoot = css3d.domElement;
  labelRoot.style.position = "absolute";
  labelRoot.style.inset = "0";
  labelRoot.style.overflow = "hidden";
  labelRoot.style.pointerEvents = "none";
  labelLayer.appendChild(labelRoot);

  const getTex = (src: string) => {
    const cached = texCache[src];
    if (cached) return cached;
    const t = loader.load(src, (loaded) => {
      // Feed the real image aspect to every material using it, so the shader's
      // object-cover crop is right rather than assuming 4:3.
      const asp = loaded.image.width / loaded.image.height;
      for (const m of cardMats) {
        if (m.uniforms.map.value === loaded) m.uniforms.uImgAspect.value = asp;
      }
    });
    t.anisotropy = maxAniso;
    t.encoding = THREE.sRGBEncoding;
    texCache[src] = t;
    textures.push(t);
    return t;
  };

  // Rounded-rect SDF mask (anti-aliased via derivatives) + object-cover crop +
  // sRGB→linear, so the composer's gamma pass lands the card back at its true colour.
  const makeCardMaterial = (map: THREE.Texture) =>
    new THREE.ShaderMaterial({
      uniforms: {
        map: { value: map },
        uAspect: { value: P.cardW / P.cardH },
        uImgAspect: { value: 4 / 3 },
        uRadius: { value: P.cornerRadius },
      },
      transparent: true,
      extensions: { derivatives: true },
      vertexShader: `varying vec2 vUv;
        void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`,
      // No inline `#extension` directive: `extensions.derivatives` above makes three
      // emit it at the top of the prefix, where GLSL requires it. A second one in the
      // body sits after non-preprocessor tokens and hard-errors on stricter drivers.
      fragmentShader: `precision highp float;
        uniform sampler2D map; uniform float uAspect, uImgAspect, uRadius; varying vec2 vUv;
        float sdRR(vec2 p, vec2 b, float r){ vec2 q = abs(p) - b + r; return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r; }
        void main(){
          vec2 p = (vUv - 0.5); p.x *= uAspect;
          float d = sdRR(p, vec2(0.5 * uAspect, 0.5), uRadius);
          float aa = max(fwidth(d), 1e-4);
          float inside = 1.0 - smoothstep(0.0, aa, d);
          if(inside < 0.003) discard;
          vec2 s = uAspect > uImgAspect ? vec2(1.0, uImgAspect / uAspect) : vec2(uAspect / uImgAspect, 1.0);
          vec2 iuv = (vUv - 0.5) * s + 0.5;
          vec3 tex = pow(texture2D(map, iuv).rgb, vec3(2.2));
          gl_FragColor = vec4(tex, inside);
        }`,
    });

  // Ring slots: as many as fit at cardW+cardGap, cycling through the cards.
  const circ = 2 * Math.PI * P.ringRadius;
  const RING_N = Math.max(cards.length, Math.floor(circ / (P.cardW + P.cardGap)));
  const cardY = P.cardLift + P.cardH / 2;
  const cardGeos: THREE.BufferGeometry[] = [];
  for (let i = 0; i < RING_N; i++) {
    const cd = cards[i % cards.length];
    const a = (i / RING_N) * Math.PI * 2;
    const g = new THREE.Group();
    g.position.set(Math.sin(a) * P.ringRadius, cardY, Math.cos(a) * P.ringRadius);
    g.rotation.y = a + Math.PI; // face the ring centre
    g.userData = { scale: 1 };

    const mat = makeCardMaterial(getTex(cd.image));
    cardMats.push(mat);
    const geo = curvedCardGeo(P.cardW, P.cardH, P.ringRadius, P.cardCurve);
    cardGeos.push(geo);
    const img = new THREE.Mesh(geo, mat);
    img.userData.card = g;
    g.add(img);
    cardMeshes.push(img);

    // Label as real 3D DOM (CSS3D) — parented to the card so it shares the card's
    // perspective, but stays crisp text rather than a rasterised texture.
    const el = document.createElement("div");
    el.textContent = cd.title;
    Object.assign(el.style, {
      whiteSpace: "nowrap",
      textAlign: "center",
      fontFamily: "inherit",
      textTransform: "uppercase",
      textShadow: "0 1px 12px rgba(0,0,0,.7)",
      backfaceVisibility: "hidden",
      WebkitFontSmoothing: "antialiased",
      fontSize: `${P.labelSize}px`,
      color: P.labelColor,
      fontWeight: String(P.labelWeight),
      letterSpacing: `${P.labelTracking}px`,
      opacity: String(P.labelOpacity),
    } as Partial<CSSStyleDeclaration>);
    const lobj = new CSS3DObject(el);
    lobj.scale.setScalar(LABEL_SCALE);
    lobj.position.set(0, P.cardH / 2 + P.labelOffset, 0.02);
    g.add(lobj);
    cardLabels.push({ el, obj: lobj });
    carousel.add(g);
  }

  // ── Water ──────────────────────────────────────────────────────────────────
  const trail = Array.from(
    { length: TRAIL_N },
    () => new THREE.Vector3(0, 0, -1000),
  );
  const reflectRT = new THREE.WebGLRenderTarget(1, 1, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
  });
  const reflectCam = new THREE.PerspectiveCamera();
  const textureMatrix = new THREE.Matrix4();

  const wu = {
    tReflect: { value: reflectRT.texture },
    uTexMatrix: { value: textureMatrix },
    uTime: { value: 0 },
    uCamPos: { value: new THREE.Vector3() },
    uDeep: { value: hexToVec3(P.waterDeep) },
    uTint: { value: hexToVec3(P.waterTint) },
    uReflBright: { value: P.reflBright },
    uRipScale: { value: P.rippleScale },
    uRipDistort: { value: P.rippleDistort },
    uGlint: { value: P.waterGlint },
    uFresnel: { value: P.fresnelPow },
    uTrail: { value: trail },
  };
  const waterGeo = new THREE.PlaneGeometry(240, 240);
  const waterMat = new THREE.ShaderMaterial({
    uniforms: wu,
    vertexShader: `precision highp float; uniform mat4 uTexMatrix; varying vec4 vRefl; varying vec3 vWpos;
      void main(){ vec4 wp = modelMatrix * vec4(position,1.); vWpos = wp.xyz; vRefl = uTexMatrix * vec4(position,1.);
        gl_Position = projectionMatrix * viewMatrix * wp; }`,
    fragmentShader: `
      precision highp float;
      #define TRAIL_N ${TRAIL_N}
      #define FADE_START 14.0
      #define FADE_END 50.0
      uniform sampler2D tReflect; uniform float uTime, uReflBright, uRipScale, uRipDistort, uGlint, uFresnel;
      uniform vec3 uCamPos, uDeep, uTint; uniform vec3 uTrail[TRAIL_N];
      varying vec4 vRefl; varying vec3 vWpos;
      void wave(vec2 p, vec2 d, float k, float w, float a, inout vec2 grad){ grad += a * k * cos(dot(d,p)*k + uTime*w) * d; }
      void main(){
        vec2 p = vWpos.xz;
        // The pool is 240 units across but fades to flat uDeep by 50 (see the mix at the
        // end), so everything past that shaded four waves, a 14-step ripple loop and a
        // reflection fetch only to be thrown away. That is most of the lower screen on a
        // wide viewport. Bail immediately instead — mathematically identical output.
        float dist = length(p - uCamPos.xz);
        if (dist > FADE_END) { gl_FragColor = vec4(uDeep, 1.0); return; }
        vec2 grad = vec2(0.0); float A = uRipScale;
        wave(p, normalize(vec2( 1.0, 0.35)), 1.7, 1.30, 0.045*A, grad);
        wave(p, normalize(vec2(-0.6, 1.0 )), 2.4, 1.05, 0.034*A, grad);
        wave(p, normalize(vec2( 0.4,-1.0 )), 3.6, 1.70, 0.022*A, grad);
        wave(p, normalize(vec2(-1.0,-0.2 )), 5.1, 2.20, 0.013*A, grad);
        float crest = 0.0;
        for(int i=0;i<TRAIL_N;i++){
          vec3 e = uTrail[i]; float age = uTime - e.z;
          if(age > 0.0 && age < 2.4){
            float d = distance(p, e.xy); float rad = age * 2.1;
            float band = exp(-pow((d - rad) * 3.2, 2.0)); float decay = (1.0 - age / 2.4);
            vec2 dir = d > 1e-4 ? (p - e.xy) / d : vec2(0.0);
            grad += dir * (-sin((d - rad) * 9.0) * 9.0 * band * decay * 0.010 * A);
            crest += cos((d - rad) * 9.0) * band * decay;
          }
        }
        vec3 N = normalize(vec3(-grad.x, 1.0, -grad.y));
        vec3 V = normalize(uCamPos - vWpos);
        vec2 ruv = vRefl.xy / vRefl.w; ruv += N.xz * uRipDistort;
        vec3 refl = texture2D(tReflect, clamp(ruv, 0.001, 0.999)).rgb * uReflBright;

        float fres = 0.02 + 0.95 * pow(1.0 - clamp(dot(V, N), 0.0, 1.0), uFresnel);
        vec3 deep = mix(uDeep, uTint, 0.25 + 0.25 * N.y);
        vec3 col = mix(deep, refl, fres);

        vec3 gdir = normalize(vec3(0.2, 1.0, -0.3)); vec3 H = normalize(gdir + V);
        float spec = pow(clamp(dot(N, H), 0.0, 1.0), 200.0);
        col += vec3(0.36, 0.5, 0.7) * spec * uGlint;
        col += refl * max(crest, 0.0) * 0.09;

        col = mix(col, uDeep, smoothstep(FADE_START, FADE_END, dist));
        gl_FragColor = vec4(col, 1.0);
      }`,
  });
  const water = new THREE.Mesh(waterGeo, waterMat);
  water.rotation.x = -Math.PI / 2;
  scene.add(water);

  // Planar reflection: mirror the camera across the water plane, apply an oblique
  // near-clip so nothing under the surface leaks in, and render into `reflectRT`.
  const _rN = new THREE.Vector3();
  const _rW = new THREE.Vector3();
  const _cW = new THREE.Vector3();
  const _rot = new THREE.Matrix4();
  const _la = new THREE.Vector3();
  const _vw = new THREE.Vector3();
  const _tg = new THREE.Vector3();
  const _q = new THREE.Vector4();
  const _cl = new THREE.Vector4();
  const _pl = new THREE.Plane();
  const updateReflection = () => {
    _rW.setFromMatrixPosition(water.matrixWorld);
    _cW.setFromMatrixPosition(camera.matrixWorld);
    _rot.extractRotation(water.matrixWorld);
    _rN.set(0, 0, 1).applyMatrix4(_rot);
    _vw.subVectors(_rW, _cW);
    if (_vw.dot(_rN) > 0) return; // camera is under the water — nothing to mirror
    _vw.reflect(_rN).negate().add(_rW);
    _rot.extractRotation(camera.matrixWorld);
    _la.set(0, 0, -1).applyMatrix4(_rot).add(_cW);
    _tg.subVectors(_rW, _la).reflect(_rN).negate().add(_rW);
    reflectCam.position.copy(_vw);
    reflectCam.up.set(0, 1, 0).applyMatrix4(_rot).reflect(_rN);
    reflectCam.lookAt(_tg);
    reflectCam.far = camera.far;
    reflectCam.updateMatrixWorld();
    reflectCam.projectionMatrix.copy(camera.projectionMatrix);
    textureMatrix.set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1);
    textureMatrix.multiply(reflectCam.projectionMatrix);
    textureMatrix.multiply(reflectCam.matrixWorldInverse);
    textureMatrix.multiply(water.matrixWorld);
    _pl
      .setFromNormalAndCoplanarPoint(_rN, _rW)
      .applyMatrix4(reflectCam.matrixWorldInverse);
    _cl.set(_pl.normal.x, _pl.normal.y, _pl.normal.z, _pl.constant);
    const M = reflectCam.projectionMatrix;
    _q.x = (Math.sign(_cl.x) + M.elements[8]) / M.elements[0];
    _q.y = (Math.sign(_cl.y) + M.elements[9]) / M.elements[5];
    _q.z = -1.0;
    _q.w = (1.0 + M.elements[10]) / M.elements[14];
    _cl.multiplyScalar(2.0 / _cl.dot(_q));
    M.elements[2] = _cl.x;
    M.elements[6] = _cl.y;
    M.elements[10] = _cl.z + 1.0;
    M.elements[14] = _cl.w;
    water.visible = false;
    const prev = renderer.getRenderTarget();
    renderer.setRenderTarget(reflectRT);
    renderer.clear();
    renderer.render(scene, reflectCam);
    renderer.setRenderTarget(prev);
    water.visible = true;
  };

  // Gamma only. The spec's UnrealBloomPass ran at zero strength — five blur passes a
  // frame for no pixels — so it is gone; the gamma pass is load-bearing (see header).
  const composer = new EffectComposer(renderer);
  composer.setPixelRatio(dpr);
  composer.setSize(w, h);
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(new ShaderPass(GammaCorrectionShader));

  // ── Interaction ────────────────────────────────────────────────────────────
  let dragging = false;
  let lastX = 0;
  let spinVel = 0;
  let nudged = false;
  const mouseTarget = new THREE.Vector2();
  const mouse = new THREE.Vector2();
  const ndc = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();
  let hovered: THREE.Object3D | null = null;
  const _ro = new THREE.Vector3();
  const _rd = new THREE.Vector3();

  const toNdc = (cx: number, cy: number) => {
    const r = canvas.getBoundingClientRect();
    return {
      x: ((cx - r.left) / Math.max(1, r.width)) * 2 - 1,
      y: -(((cy - r.top) / Math.max(1, r.height)) * 2 - 1),
    };
  };

  /** Ray the pointer onto the y=0 water plane; null if it misses (or points up). */
  const pointerToWater = (cx: number, cy: number) => {
    const n = toNdc(cx, cy);
    ndc.set(n.x, n.y);
    raycaster.setFromCamera(ndc, camera);
    _ro.copy(raycaster.ray.origin);
    _rd.copy(raycaster.ray.direction);
    if (_rd.y > -1e-4) return null;
    const t = (0 - _ro.y) / _rd.y;
    if (t <= 0 || t > 80) return null;
    return { x: _ro.x + _rd.x * t, z: _ro.z + _rd.z * t };
  };

  let trailHead = 0;
  let lastRx = 1e9;
  let lastRz = 1e9;
  const dropRipple = (cx: number, cy: number) => {
    const p = pointerToWater(cx, cy);
    if (!p) return;
    if (Math.hypot(p.x - lastRx, p.z - lastRz) < 0.14) return; // space the drops out
    trail[trailHead].set(p.x, p.z, wu.uTime.value);
    trailHead = (trailHead + 1) % TRAIL_N;
    lastRx = p.x;
    lastRz = p.z;
  };

  const onPointerDown = (e: PointerEvent) => {
    dragging = true;
    lastX = e.clientX;
    spinVel = 0;
    canvas.style.cursor = "grabbing";
    canvas.setPointerCapture(e.pointerId);
    dropRipple(e.clientX, e.clientY);
    if (!nudged) {
      nudged = true;
      onFirstDrag?.();
    }
  };
  const onPointerMove = (e: PointerEvent) => {
    const n = toNdc(e.clientX, e.clientY);
    mouseTarget.set(n.x, n.y);
    dropRipple(e.clientX, e.clientY);
    if (!dragging) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;
    const d = -dx * P.dragSpeed;
    carousel.rotation.y += d;
    spinVel = d;
  };
  const endDrag = () => {
    dragging = false;
    canvas.style.cursor = "grab";
  };
  const onPointerLeave = () => {
    mouseTarget.set(0, 0); // recentre the camera drift when the pointer leaves
  };
  canvas.style.cursor = "grab";
  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", endDrag);
  canvas.addEventListener("pointercancel", endDrag);
  canvas.addEventListener("pointerleave", onPointerLeave);

  const updateHover = () => {
    if (dragging) {
      hovered = null;
      return;
    }
    raycaster.setFromCamera(mouseTarget, camera);
    const hit = raycaster.intersectObjects(cardMeshes, false)[0];
    hovered = hit ? (hit.object.userData.card as THREE.Object3D) : null;
  };

  // The card facing the camera sits at world angle π, so the front slot is
  // round((π − rotation) / 2π · N) — and the card in it is that slot mod card count.
  let focusIdx = -1;
  const syncFocus = () => {
    let slot = Math.round(
      ((Math.PI - carousel.rotation.y) / (2 * Math.PI)) * RING_N,
    );
    slot = ((slot % RING_N) + RING_N) % RING_N;
    const idx = slot % cards.length;
    if (idx === focusIdx) return;
    focusIdx = idx;
    onFocusChange?.(idx);
  };

  // ── Loop ───────────────────────────────────────────────────────────────────
  let prevT = performance.now();
  let frameNo = 0;
  const render = () => {
    const now = performance.now();
    const dt = Math.min((now - prevT) / 1000, 0.05);
    prevT = now;

    if (!dragging) {
      carousel.rotation.y += spinVel + (reducedMotion ? 0 : P.autoSpin * dt);
      spinVel *= P.inertiaDamp;
    }
    updateHover();
    syncFocus();
    for (const g of carousel.children) {
      const tgt = g === hovered ? P.hoverScale : 1;
      const s = g.userData.scale as number;
      g.userData.scale = s + (tgt - s) * Math.min(1, dt * 12);
      g.scale.setScalar(g.userData.scale as number);
    }
    if (!reducedMotion) {
      mouse.lerp(mouseTarget, 0.06);
      camera.position.x = mouse.x * 0.35;
      camera.position.y = P.camHeight + mouse.y * 0.18;
      camera.lookAt(lookTarget);
      wu.uTime.value = now / 1000;
    }
    wu.uCamPos.value.copy(camera.position);

    // The reflection lags one frame every other frame. Invisible at 0.25 brightness
    // through moving ripples, and it halves the cost of the most expensive pass.
    if (frameNo % REFLECT_EVERY === 0) updateReflection();
    frameNo++;
    composer.render();
    css3d.render(scene, camera);
  };

  let raf = 0;
  let running = false;
  const loop = () => {
    render();
    raf = requestAnimationFrame(loop);
  };
  const startLoop = () => {
    if (running) return;
    running = true;
    prevT = performance.now(); // don't step dt across the paused gap
    raf = requestAnimationFrame(loop);
  };
  const stopLoop = () => {
    if (!running) return;
    running = false;
    cancelAnimationFrame(raf);
    raf = 0;
  };
  // ADR-0016 — only render while the section is on (or just off) screen.
  const io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) startLoop();
      else stopLoop();
    },
    { rootMargin: "300px 0px" },
  );
  io.observe(parent);

  const resize = () => {
    const s = sizeOf();
    w = s.w;
    h = s.h;
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    composer.setPixelRatio(dpr);
    composer.setSize(w, h);
    css3d.setSize(w, h);
    reflectRT.setSize(
      Math.max(1, Math.floor(w * REFLECT_SCALE)),
      Math.max(1, Math.floor(h * REFLECT_SCALE)),
    );
  };
  const ro = new ResizeObserver(resize);
  ro.observe(parent);
  resize();
  syncFocus();

  // Warm the card + water programs before the section scrolls in (ADR-0016), so the
  // first visible frame doesn't hitch on shader compilation.
  try {
    renderer.compile(scene, camera);
  } catch {
    /* best-effort — the first render compiles if this throws */
  }

  return {
    dispose() {
      stopLoop();
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", endDrag);
      canvas.removeEventListener("pointercancel", endDrag);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      for (const l of cardLabels) l.el.remove();
      labelRoot.remove();
      for (const g of cardGeos) g.dispose();
      for (const m of cardMats) m.dispose();
      for (const t of textures) t.dispose();
      skyGeo.dispose();
      skyMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      waterGeo.dispose();
      waterMat.dispose();
      reflectRT.dispose();
      (composer as unknown as { dispose?: () => void }).dispose?.();
      renderer.dispose();
      // Release the context so a remount (StrictMode/HMR) can attach a fresh
      // renderer to the same canvas instead of failing on the existing one.
      renderer.forceContextLoss();
    },
  };
}
