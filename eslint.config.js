import js from "@eslint/js";
import astro from "eslint-plugin-astro";
import globals from "globals";
import prettier from "eslint-config-prettier";

export default [
  { ignores: ["dist/", ".astro/", "node_modules/"] },
  js.configs.recommended,
  ...astro.configs["flat/recommended"],
  { languageOptions: { globals: { ...globals.browser } } },
  prettier,
];
