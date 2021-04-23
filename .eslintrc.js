module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'no-console': 0,
    'no-restricted-syntax': 0,
    'import/extensions': 0, // node requires explicit extensions
    'implicit-arrow-linebreak': 0, // I really don't like this rule
  },
};
