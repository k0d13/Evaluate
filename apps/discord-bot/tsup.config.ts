import { defineConfig } from 'tsup';
import saykit from 'unplugin-saykit/esbuild';

export default defineConfig({
  entry: ['src/index.ts'],
  noExternal: [/^@evaluate\//, 'piston.ts'],
  format: 'esm',
  esbuildPlugins: [saykit()],
});
