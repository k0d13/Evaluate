import { defineConfig } from '@saykit/config';
import json from '@saykit/format-json';
import js from '@saykit/transform-js';
import jsx from '@saykit/transform-jsx';

export default defineConfig({
  locales: ['en'],
  buckets: [
    {
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.d.*.ts', 'src/locales/**'],
      output: 'src/locales/{locale}.{extension}',
      formatter: json(),
      transformer: [js(), jsx()],
    },
  ],
});
