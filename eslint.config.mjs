import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import prettierPlugin from 'eslint-plugin-prettier';
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

const eslintConfig = [
  ...compat.extends(
    'next',
    'eslint:recommended',
    'prettier',
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ),
  {
    plugins: {
      prettier: prettierPlugin,
      'simple-import-sort': simpleImportSortPlugin,
    },
    rules: {
      // JavaScript rules
      'prefer-const': 'warn',
      'no-var': 'warn',
      'no-unused-vars': 'warn',
      'object-shorthand': 'warn',
      'quote-props': ['warn', 'as-needed'],

      // TypeScript rules
      '@typescript-eslint/array-type': ['warn', { default: 'array' }],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],

      // React rules
      'react-hooks/rules-of-hooks': 'error',
      'react/react-in-jsx-scope': 'off',

      // Prettier integration
      'prettier/prettier': 'warn',

      // Import sorting
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];

export default eslintConfig;
