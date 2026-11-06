/// <reference types="node" />
import { readFile } from 'node:fs/promises';
import { defineConfig } from 'oxfmt';

const vscodeSettings = await readFile('.vscode/settings.json', 'utf-8') //
  .then((data) => JSON.parse(data.replaceAll(/^\s*\/\/.*$/gm, '')));

export default defineConfig({
  singleQuote: true,
  sortImports: {
    groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'unknown'],
    newlinesBetween: false,
  },
  sortPackageJson: {
    sortScripts: true,
  },
  sortTailwindcss: {
    stylesheet: 'apps/website/src/style.css',
    functions: vscodeSettings['tailwindCSS.classFunctions'],
    attributes: vscodeSettings['tailwindCSS.classAttributes'],
  },
  jsdoc: true,
  ignorePatterns: [
    'pnpm-lock.yaml',
    'patches/',
    '**/*.po',
    'apps/browser-extension/public/',
    'apps/website/public/',
  ],
});
