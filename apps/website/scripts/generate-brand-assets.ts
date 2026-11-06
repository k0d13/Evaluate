// Renders every PNG icon from public/icon.svg, the one source of truth for the logo:
//   public/apple-touch-icon.png        180×180, opaque as iOS requires
//   public/icon-192.png, icon-512.png  the web manifest icons
//   public/icon-maskable.png           512×512 with the safe zone padding maskable icons need
//   ../browser-extension/public/icon-{16,32,48,128}.png
//
// Usage: pnpm --filter website generate:assets

import { mkdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

const website = join(import.meta.dirname, '..');
const extension = join(website, '../browser-extension');
const source = await readFile(join(website, 'public/icon.svg'));

const BACKGROUND = '#0a0a0a';

/** The logo drawn at `size`, on `background` and inset by `padding` (a fraction of the size) */
async function render(
  path: string,
  size: number,
  { background = 'transparent', padding = 0 } = {},
) {
  const inner = Math.round(size * (1 - padding * 2));
  const logo = await sharp(source, { density: (72 * inner) / 512 })
    .resize(inner, inner)
    .png()
    .toBuffer();

  await mkdir(join(path, '..'), { recursive: true });
  await sharp({ create: { width: size, height: size, channels: 4, background } })
    .composite([{ input: logo, gravity: 'centre' }])
    .png({ compressionLevel: 9 })
    .toFile(path);
  console.log(`[brand] ${path.replace(join(website, '..', '..'), '').replaceAll('\\', '/')}`);
}

await render(join(website, 'public/apple-touch-icon.png'), 180, {
  background: BACKGROUND,
  padding: 0.12,
});
await render(join(website, 'public/icon-192.png'), 192);
await render(join(website, 'public/icon-512.png'), 512);
await render(join(website, 'public/icon-maskable.png'), 512, {
  background: BACKGROUND,
  padding: 0.2,
});
for (const size of [16, 32, 48, 128])
  await render(join(extension, `public/icon-${size}.png`), size);
