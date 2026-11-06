import { defineConfig } from '@saykit/config';
import po from '@saykit/format-po';
import js from '@saykit/transform-js';
import jsx from '@saykit/transform-jsx';

export default defineConfig({
  locales: ['en'],
  buckets: [
    {
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.d.*.ts', 'src/locales/**'],
      output: 'src/locales/{locale}.{extension}',
      formatter: po(),
      transformer: [js(), jsx()],
    },
  ],
});
