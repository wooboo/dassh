module.exports = {
  extends: [
    "./base.js",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:react/jsx-runtime"
  ],
  plugins: [
    "react",
    "react-hooks"
  ],
  settings: {
    react: {
      version: "detect"
    }
  },
  rules: {
    // React specific rules
    "react/prop-types": "off", // Using TypeScript for prop validation
    "react/react-in-jsx-scope": "off", // Not needed with new JSX transform
    "react/display-name": "warn",
    "react/no-unescaped-entities": "error",
    "react/jsx-key": "error",
    "react/jsx-no-duplicate-props": "error",
    "react/jsx-no-undef": "error",
    "react/jsx-uses-react": "off", // Not needed with new JSX transform
    "react/jsx-uses-vars": "error",
    "react/no-children-prop": "error",
    "react/no-danger-with-children": "error",
    "react/no-deprecated": "error",
    "react/no-direct-mutation-state": "error",
    "react/no-find-dom-node": "error",
    "react/no-is-mounted": "error",
    "react/no-render-return-value": "error",
    "react/no-string-refs": "error",
    "react/no-unknown-property": "error",
    "react/require-render-return": "error",
    
    // React Hooks rules
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  },
  env: {
    browser: true,
    es2022: true
  }
};