import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import stylisticJs from '@stylistic/eslint-plugin-js'
import tsParser from '@typescript-eslint/parser'

export default tseslint.config(
  { ignores: ['lib'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      '@stylistic/js': stylisticJs
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      '@stylistic/js/quotes': ['warn', 'single'],
      '@stylistic/js/quote-props': ['error', 'as-needed'],
      'no-warning-comments': [
        'error',
        {
          terms: ['eslint-disable']
        }
      ],
    },
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['*.{ts,js}'],
    plugins: {
      '@typescript-eslint': typescriptEslint,
      '@stylistic/js': stylisticJs
    },

    languageOptions: {
      globals: {
        ...globals.node,
      },

      parser: tsParser,
      ecmaVersion: 6,
      sourceType: 'module',
    },
    rules: {
      '@stylistic/js/quotes': ['warn', 'single'],
      '@stylistic/js/quote-props': ['error', 'as-needed'],
      'no-warning-comments': [
        'error',
        {
          terms: ['eslint-disable']
        }
      ],
    },
  },
)
