module.exports = {
  root: true,
  plugins: ['import', '@typescript-eslint'],
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
    'standard-with-typescript',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:import/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['**/tsconfig.json'],
  },
  rules: {
    curly: ['error', 'all'],
    'max-lines-per-function': ['error', 40],
    '@typescript-eslint/no-inferrable-types': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-member-accessibility': [
      'error',
      {
        accessibility: 'explicit',
        overrides: {
          constructors: 'off',
        },
      },
    ],
    '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'never' }],
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/consistent-type-exports': 'error',
    '@typescript-eslint/consistent-type-imports': 'error',
    'import/no-unresolved': 'error',
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    'import/extensions': ['error', 'ignorePackages', { js: 'never', ts: 'never' }],
  },
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      extends: ['plugin:@typescript-eslint/disable-type-checked'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  settings: {
    'import/resolver': {
      typescript: true,
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts'],
    },
  },
};
