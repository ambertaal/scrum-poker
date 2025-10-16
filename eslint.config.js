const { ESLint } = require("eslint");
const customRules = require("./eslint-rules/index.cjs");

module.exports = [
  {
    ignores: ["node_modules/**", "dist/**"]
  },
  {
    files: ["**/*.js", "**/*.cjs", "**/*.ts", "**/*.vue"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: require("vue-eslint-parser"),
      parserOptions: {
        parser: "@typescript-eslint/parser"
      }
    },
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
      vue: require("eslint-plugin-vue"),
      "custom": customRules
    },
    rules: {
      "vue/multi-word-component-names": "off",
      "vue/no-unused-properties": "error",
      "require-await": "error",
      "no-async-promise-executor": "error",
      "custom/cy-data-attribute": "warn"
    }
  },
  {
    files: [".eslintrc.{js,cjs}"],
    languageOptions: {
      sourceType: "script"
    },
    env: {
      node: true
    }
  }
];
