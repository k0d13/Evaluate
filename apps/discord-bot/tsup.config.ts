import { defineConfig } from 'tsup';
import sayable from 'unplugin-sayable/esbuild';

export default defineConfig({
  entry: ['src/index.ts'],
  format: 'esm',
  dts: true,
  esbuildPlugins: [sayable()],
});
