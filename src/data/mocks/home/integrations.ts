/** 03 Integrations — Figma 3888:5781 (1440) / 3888:10189 (1024) / 3832:7456 (768) / 3893:3056 (390). Copy is verbatim from the frames. */
export const integrationsMock = {
  caption: "connects to 240 apps, and to whatever you built yourself",
  /** The same caption as the 390 frame breaks it (centred, two lines). */
  captionLines390: [
    "connects to 240 apps, and to",
    "whatever you built yourself",
  ],
  /**
   * Which frames draw each tile. `in1024` covers 1024 and 768 (notion and
   * gmail drop out); `in390` is the 390 frame (slack, stripe, postgres, notion).
   */
  apps: [
    { name: "slack", initials: "SL", active: false, in1024: true, in390: true },
    { name: "stripe", initials: "ST", active: true, in1024: true, in390: true },
    {
      name: "postgres",
      initials: "PG",
      active: false,
      in1024: true,
      in390: true,
    },
    {
      name: "hubspot",
      initials: "HS",
      active: false,
      in1024: true,
      in390: false,
    },
    {
      name: "notion",
      initials: "NO",
      active: false,
      in1024: false,
      in390: true,
    },
    {
      name: "gmail",
      initials: "GM",
      active: false,
      in1024: false,
      in390: false,
    },
    {
      name: "webhooks",
      initials: "WH",
      active: false,
      in1024: true,
      in390: false,
    },
    {
      name: "233 more",
      initials: "+",
      active: false,
      in1024: true,
      in390: false,
    },
  ],
} as const;

export type IntegrationsContent = typeof integrationsMock;
export type IntegrationsApp = IntegrationsContent["apps"][number];
