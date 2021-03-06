module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  extends: [
    "plugin:@typescript-eslint/recommended",
    // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    "prettier/@typescript-eslint",
    // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    "plugin:prettier/recommended",
    // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  ignorePatterns: ["*.svelte"],
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
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/naming-convention": [
      "error",
      { selector: "variable", modifiers: ["const"], format: ["snake_case", "UPPER_CASE"] },
      { selector: "variable", modifiers: ["global"], format: ["UPPER_CASE"] },
      { selector: "default", format: ["snake_case", "camelCase"] },
      { selector: "typeLike", format: ["PascalCase"] },
      { selector: "enum", format: ["UPPER_CASE"] },
    ],
    "@typescript-eslint/no-inferrable-types": "off",
    "@typescript-eslint/explicit-function-return-type": [
      "error",
      {
        allowExpressions: true,
      },
    ],
    "@typescript-eslint/no-magic-numbers": [
      "warn",
      { ignoreEnums: true, ignoreNumericLiteralTypes: true, ignoreArrayIndexes: true, ignore: [0, 1] },
    ],
    "@typescript-eslint/prefer-for-of": ["error"],
    "@typescript-eslint/no-namespace": "off",
    "@typescript-eslint/explicit-member-accessibility": ["error"],
  },
};
