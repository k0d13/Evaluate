import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import generate from '@babel/generator';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import type { Plugin } from 'vite';

/** Babel's source map type is looser than the one rolldown accepts. */
function toResult({ code, map }: ReturnType<typeof generate>) {
  return { code, map: map as never };
}

/**
 * Vite plugin to remove the external script loading from posthog-js. This is required because
 * chrome extensions do not allow loading external scripts due to security reasons.
 */
export function removeExternalScriptLoading(): Plugin {
  return {
    name: 'modify-load-script',
    enforce: 'pre',
    transform(code, id) {
      if (!id.includes('posthog-js/dist/module.js')) return null;

      const ast = parse(code, {
        sourceType: 'module',
      });

      traverse(ast, {
        VariableDeclarator(path) {
          if (
            t.isArrowFunctionExpression(path.node.init) &&
            path.node.init.params.length === 3 &&
            t.isBlockStatement(path.node.init.body)
          ) {
            const ifStatement = path.node.init.body.body //
              .find((node) => t.isIfStatement(node));
            if (t.isReturnStatement(ifStatement?.consequent))
              path.node.init.body = ifStatement.consequent.argument!;
          }
        },
      });

      return toResult(generate(ast));
    },
  };
}

/** Vite plugin to inline JSON imports with attributes as const declarations. */
export function replaceJsonImports(): Plugin {
  return {
    name: 'replace-json-imports',
    enforce: 'pre',
    async transform(code, id) {
      if (!code.includes('.json')) return null;

      const ast = parse(code, {
        sourceType: 'module',
        plugins: ['typescript', 'jsx'],
      });

      traverse(ast, {
        ImportDeclaration(path) {
          const importNode = path.node;

          if (importNode.source.value.endsWith('.json')) {
            const varName = importNode.specifiers[0]!.local.name;
            const jsonPath = resolve(dirname(id), importNode.source.value);
            const jsonContent = JSON.parse(readFileSync(jsonPath, 'utf8'));

            path.replaceWith(
              t.variableDeclaration('const', [
                t.variableDeclarator(t.identifier(varName), t.valueToNode(jsonContent)),
              ]),
            );
          }
        },
      });

      return toResult(generate(ast));
    },
  };
}
