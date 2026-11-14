import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Hard rule 7 ("No any") is enforced here, not only by verify.sh.
      // `_`-prefixed names and rest-siblings are deliberate prop stripping
      // (e.g. the robot-* fallbacks drop motion-only props before rendering).
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      // Kept visible, not blocking: these effects sync state from browser-only
      // sources (matchMedia, consent storage, hydration) in motion code where a
      // refactor needs a visual QA pass. See decisions-log ADR-0030.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  {
    // The vendored animation engine (stack.json → paths.protected) is consumed,
    // not edited (AGENTS.md hard rule 2) — so its known debts are not lint
    // errors here. App code gets the full rule set.
    files: ["src/components/animation/springs/**", "src/hooks/animation/**"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-unused-expressions": "off",
    },
  },
]);

export default eslintConfig;
