import { defineConfig } from '@saykit/config';
import po from '@saykit/format-po';
import js from '@saykit/transform-js';

export default defineConfig({
  locales: ['en'],
  buckets: [
    {
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.d.*.ts', 'src/locales/**'],
      output: 'src/locales/{locale}.{extension}',
      formatter: po(),
      transformer: js(),
    },
  ],
});
