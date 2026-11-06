import { defineConfig } from '@saykit/config';
import json from '@saykit/format-json';
import js from '@saykit/transform-js';

export default defineConfig({
  locales: ['en'],
  buckets: [
    {
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.d.*.ts', 'src/locales/**'],
      output: 'src/locales/{locale}.{extension}',
      formatter: json(),
      transformer: js(),
    },
  ],
});
