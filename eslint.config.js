//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'
import importPlugin from 'eslint-plugin-import-x'

export default [
  ...tanstackConfig,
  {
    plugins: { import: importPlugin },
    rules: {
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/require-await': 'off',
      'sort-imports': ['error', { ignoreDeclarationSort: true }],
      'import/order': [
        'error',
        {
          groups: [
            'type',
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          pathGroups: [
            { pattern: 'react', group: 'external', position: 'before' },
            { pattern: 'react-dom', group: 'external', position: 'before' },
            {
              pattern: 'react-dom/**',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@tanstack/**',
              group: 'external',
              position: 'before',
            },
            { pattern: '@/**', group: 'internal' },
            { pattern: '**/*.css', group: 'index', position: 'after' },
          ],
          pathGroupsExcludedImportTypes: ['type'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },
  {
    ignores: [
      'eslint.config.js',
      'prettier.config.js',
      'src/lib/shopify/generated/**',
    ],
  },
]
