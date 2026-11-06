import { defineConfig } from 'tsup';
import saykit from 'unplugin-saykit/esbuild';

export default defineConfig({
  entry: ['src/index.ts'],
  format: 'esm',
  dts: true,
  esbuildPlugins: [saykit()],
});
