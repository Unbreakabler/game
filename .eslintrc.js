/* eslint-disable */
const eslintSveltePreprocess = require("eslint-svelte3-preprocess");
const sveltePreprocess = require("svelte-preprocess");
const preprocess = sveltePreprocess();

module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  extends: ["eslint:recommended"],
  plugins: ["svelte3", "@typescript-eslint", "prettier"],
  parserOptions: {
    ecmaVersion: 2020,
    // Allows for the parsing of modern ECMAScript features
    sourceType: "module",
    // Allows for the use of imports
  },
  env: {
    es2020: true,
    browser: true,
    node: true,
  },
  overrides: [
    {
      files: ["*.svelte"],
      processor: "svelte3/svelte3",
    },
    {
      files: ["*.ts", "*.json"],
      extends: [
        "plugin:@typescript-eslint/recommended",
        // Uses the recommended rules from the @typescript-eslint/eslint-plugin
        "prettier/@typescript-eslint",
        // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
        "plugin:prettier/recommended",
        // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
      ],
    },
  ],
  settings: {
    "svelte3/preprocess": eslintSveltePreprocess(preprocess),
  },
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/naming-convention": [
      "error",
      { selector: "default", format: ["snake_case"] },
      { selector: "typeLike", format: ["PascalCase"] },
      { selector: "property", format: ["snake_case","camelCase"] },
      { selector: "enum", format: ["UPPER_CASE"] },
      { selector: "enumMember", format: ["UPPER_CASE"] },
    ],
    "@typescript-eslint/no-inferrable-types": "off",
    "@typescript-eslint/explicit-function-return-type": [
      "error",
      {
        allowExpressions: true,
      },
    ],
    "@typescript-eslint/no-magic-numbers": [
      "error",
      { ignoreEnums: true, ignoreNumericLiteralTypes: true, ignoreArrayIndexes: true, ignore: [0, 1] },
    ],
    "@typescript-eslint/prefer-for-of": ["error"],
    "@typescript-eslint/no-namespace": "off",
    "@typescript-eslint/explicit-member-accessibility": ["error"],
  },
};
