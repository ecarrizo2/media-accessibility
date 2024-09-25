import typescriptEslint from '@typescript-eslint/eslint-plugin'
import jest from 'eslint-plugin-jest'
import globals from 'globals'
import tsParser from '@typescript-eslint/parser'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default [
  {
    ignores: [
      '**/*.css',
      '**/*.scss',
      '**/*.yml',
      '**/*.json',
      '**/*.md',
      '**/*.html',
      '**/*.txt',
      '**/*.svg',
      '**/*.png',
      '**/*.jpg',
      '**/*.jpeg',
    ],
  },
  ...compat
    .extends(
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:@typescript-eslint/recommended-requiring-type-checking',
      'plugin:@typescript-eslint/strict',
      'plugin:jest/recommended',
      'plugin:jest/style',
      'prettier'
    )
    .map((config) => ({
      ...config,
      files: ['**/*.ts', '**/*.js'],
    })),
  {
    files: ['**/*.ts', '**/*.js'],

    plugins: {
      '@typescript-eslint': typescriptEslint,
      jest,
    },

    languageOptions: {
      globals: {
        ...globals.node,
      },

      parser: tsParser,
      ecmaVersion: 2021,
      sourceType: 'module',

      parserOptions: {
        project: ['./tsconfig.json'],
      },
    },

    settings: {
      'import/resolver': {
        typescript: true,
        node: true,
      },
    },

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

      // 'import/no-duplicates': ['error', {
      //   'prefer-inline': true,
      // }],

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
            parameterProperties: 'no-public',
            properties: 'no-public',
          },
        },
      ],

      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/prefer-ts-expect-error': 'off',
      '@typescript-eslint/unified-signatures': 'off',
      'no-console': 'off',
    },
  },
  {
    files: ['**/*.mock.ts', '**/*.spec.tsx', '**/*.test.tsx', '**/*.test.ts', '**/*.spec.ts'],

    plugins: {
      jest,
    },

    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/unbound-method': 'off',
      'jest/unbound-method': 'off',
    },
  },
  {
    files: [
      'src/interfaces/http/services/shared/request-validator.service.ts',
      'src/interfaces/http/services/shared/request-error-handler-wrapper-service.ts',
    ],
    rules: {
      '@typescript-eslint/only-throw-error': 'off',
    },
  },
]
