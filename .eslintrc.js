module.exports = {
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  plugins: ["jest", "prettier"],
  extends: [
    "eslint:recommended",
    "plugin:jest/all",
    "plugin:prettier/recommended",
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
  rules: {},
};
