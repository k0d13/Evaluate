import { chromeExtension } from '@crxjs/vite-plugin';
import tailwindCss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import zipPack from 'vite-plugin-zip-pack';
import manifest from './manifest.json' with { type: 'json' };
import { removeExternalScriptLoading, replaceJsonImports } from './vite-plugins.ts';

export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    removeExternalScriptLoading(),
    replaceJsonImports(),
    tailwindCss(),
    react(),
    chromeExtension({
      browser: 'firefox',
      manifest: manifest as never,
    }),
    zipPack({
      inDir: 'dist/firefox',
      outDir: 'dist',
      outFileName: 'firefox.zip',
    }),
  ],
  build: {
    outDir: 'dist/firefox',
    minify: false,
    rolldownOptions: {
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
});
