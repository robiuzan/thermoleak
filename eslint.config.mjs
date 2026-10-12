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
    // The fleet deploy script preserves the previous export here for one-command rollback.
    "out.prev/**",
    // Fleet live-kit copies — byte-locked (scripts/live/check-live-copy.mjs fails the build on any
    // local edit), so a lint rule may never demand a change in them (CLAUDE.md §14).
    "lib/live/**",
    "scripts/live/**",
    "public/assets/live.js",
  ]),
]);

export default eslintConfig;
