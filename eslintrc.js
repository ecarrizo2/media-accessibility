module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:@typescript-eslint/strict',
    'plugin:jest/recommended',
    'plugin:jest/style',
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'jest'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  settings: {
    'import/resolver': {
      typescript: true,
      node: true,
    },
  },
  ignorePatterns: [
    '*.css',
    '*.scss',
    '*.yml',
    '*.json',
    '*.md',
    '*.html',
    '*.txt',
    '*.svg',
    '*.png',
    '*.jpg',
    '*.jpeg',
  ],
  rules: {
    '@typescript-eslint/consistent-indexed-object-style': 'error',
    'no-dupe-class-members': 'off',
    '@typescript-eslint/no-dupe-class-members': 'error',
    'no-redeclare': 'off',
    '@typescript-eslint/no-redeclare': 'error',
    'no-invalid-this': 'off',
    '@typescript-eslint/no-invalid-this': 'error',
    'no-unused-expressions': 'off',
    '@typescript-eslint/no-unused-expressions': 'error',
    'default-param-last': 'off',
    '@typescript-eslint/default-param-last': 'error',
    'import/no-duplicates': ['error', { 'prefer-inline': true }],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': 'error',
    'jest/no-disabled-tests': 'error',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',

    '@typescript-eslint/explicit-member-accessibility': [
      'error',
      {
        accessibility: 'explicit',
        overrides: {
          accessors: 'no-public',
          constructors: 'no-public',
          methods: 'no-public',
          parameterProperties: 'explicit',
          properties: 'no-public',
        },
      },
    ],

    // Turned Off Rules --
    '@typescript-eslint/consistent-type-definitions': 'off',
    '@typescript-eslint/prefer-ts-expect-error': 'off',
    '@typescript-eslint/unified-signatures': 'off',
    'no-console': 'off',
  },

  overrides: [
    {
      files: ['*.mock.ts', '*.spec.tsx', '*.test.tsx', '*.test.ts', '*.spec.ts'],
      plugins: ['jest'],
      rules: {
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/unbound-method': 'off',
        'jest/unbound-method': 'off',
      },
    },
  ],
}
