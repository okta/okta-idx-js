const config = {
  rules: {
    curly: 'error',
    eqeqeq: 'error',
    'eol-last': ['error', 'always'],
    indent: ['error', 2, { SwitchCase: 1 }],
    'linebreak-style': [ 'error', 'unix' ],
    'new-cap': ['error', { 'properties': false }],
    'no-unused-vars': ['error', { 'vars': 'all', 'args': 'after-used' }],
    'no-use-before-define': 'error',
    'no-trailing-spaces': 'error',
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'wrap-iife': ['error', 'outside'],
    'brace-style': ['error', '1tbs', {'allowSingleLine': true }],
    'block-spacing': ['error', 'always'],
    'keyword-spacing': ['error', { 'before': true, 'after': true, 'overrides': {} }],
    'space-before-blocks': 'error',
    'space-before-function-paren': ['error', {
      'anonymous': 'never',
      'named': 'never',
      'asyncArrow': 'always'
    }],
    'comma-spacing': ['error', { 'before': false, 'after': true }],
    'comma-style': ['error', 'last'],
    'no-lonely-if': 'error',
    'func-call-spacing': 'error',
    'space-infix-ops': 'error'
  },
  globals: {
    'SDK_VERSION': 'readonly',
  },
  env: {
    es6: true,
    node: true,
    jasmine: true, // needed for 'fail'
    'jest/globals': true,
  },
  parser: '@babel/eslint-parser',
  extends: 'eslint:recommended',
  plugins: ['jest']
};

module.exports = config;
