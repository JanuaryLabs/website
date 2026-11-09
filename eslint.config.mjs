import js from '@eslint/js';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';
import { flatConfigs as importConfigs } from 'eslint-plugin-import';
import { flat as mdx } from 'eslint-plugin-mdx';
import noRelativeImportPaths from 'eslint-plugin-no-relative-import-paths';
import storybook from 'eslint-plugin-storybook';
import globals from 'globals';

const config = [
  {
    ignores: [
      '.next',
      '.turbo',
      '.swc',
      'build',
      'coverage',
      'junit.xml',
      'storybook-static',
      'global.d.ts',
    ],
  },
  {
    files: ['public/**/*.js'],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ['**/{__tests__,__mocks__}/*.mjs'],
    languageOptions: { globals: globals.jest },
  },
  {
    ...js.configs.recommended,
    files: ['**/*.{js,mjs,ts,tsx}'],
  },
  ...nextCoreWebVitals,
  ...nextTypescript.map(config => ({ ...config, files: ['**/*.ts?(x)'] })),
  {
    files: ['**/*.{js,mjs,ts,tsx}'],
    languageOptions: { globals: globals.node },
    rules: { 'no-unused-vars': 'off' },
  },
  // eslint-config-next already registers the import plugin, and ESLint refuses a second instance of it
  {
    files: ['**/*.ts?(x)'],
    rules: importConfigs.recommended.rules,
  },
  {
    files: ['**/*.ts?(x)'],
    rules: importConfigs.typescript.rules,
    settings: importConfigs.typescript.settings,
  },
  {
    files: ['**/*.ts?(x)'],
    plugins: { 'no-relative-import-paths': noRelativeImportPaths },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/array-type': ['error', { default: 'generic' }],
      '@typescript-eslint/no-explicit-any': 'off',
      'no-relative-import-paths/no-relative-import-paths': [
        'error',
        { allowSameFolder: true, prefix: '@' },
      ],
    },
  },
  {
    files: ['**/*.tsx'],
    rules: {
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      'react/no-unescaped-entities': 'off',
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "ImportDeclaration[source.value='react'][specifiers.0.type='ImportDefaultSpecifier']",
          message:
            'Default React import not allowed since we use the TypeScript jsx-transform. If you need a global type that collides with a React named export (such as `MouseEvent`), try using `globalThis.MouseHandler`',
        },
        {
          selector:
            "ImportDeclaration[source.value='react'] :matches(ImportNamespaceSpecifier)",
          message:
            'Named * React import is not allowed. Please import what you need from React with Named Imports',
        },
      ],
    },
  },
  ...storybook.configs['flat/recommended'],
  mdx,
  prettier,
];

export default config;
