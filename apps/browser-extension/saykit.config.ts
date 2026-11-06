import { defineConfig } from '@saykit/config';
import json from '@saykit/format-json';
import js from '@saykit/transform-js';
import jsx from '@saykit/transform-jsx';

export default defineConfig({
  locales: ['en'],
  buckets: [
    {
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.d.*.ts'],
      output: '_locales/{locale}/messages.{extension}',
      messages: {
        extensionName: {
          message: 'Evaluate - Run Code Anytime, Anywhere',
        },
        extensionShortName: {
          message: 'Evaluate',
        },
        extensionDescription: {
          message: 'Execute any code snippet on any website with Evaluate.',
        },
      },
      formatter: json({ dialect: 'webextension' }),
      transformer: [js(), jsx()],
    },
  ],
});
