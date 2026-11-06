#!/usr/bin/env node

/**
 * Builds a ZIP archive of the Firefox browser extension source.
 *
 * - Excludes files listed in .gitignore and .ffignore
 * - Adds production env vars to the extension's .env.production.local
 * - Outputs to apps/browser-extension/dist/firefox-source.zip
 */

import { createWriteStream } from 'node:fs';
import { readdir, readFile, rm, stat } from 'node:fs/promises';
import { basename, dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import gitignoreParser from '@gerhobbelt/gitignore-parser';
import { ZipArchive } from 'archiver';
import { logger } from './_logger.js';

// ===== //

const rootDir = await getRootDirectory();
const outFile = //
  resolve(rootDir, 'apps/browser-extension/dist/firefox-source.zip');
await rm(outFile, { force: true });
const stream = createWriteStream(outFile);

const archive = new ZipArchive({ zlib: { level: 9 } });
archive.pipe(stream);

stream.on('close', () => {
  logger.info(`Created ${basename(outFile)}, ${archive.pointer()} total bytes`);
});

// ===== //

const ignorer = await getIgnorer(rootDir);
await addFilesToArchive(rootDir, archive, rootDir, ignorer);
await addProductionEnvironmentFilesToArchive(archive);
await archive.finalize();

// ===== //

async function getRootDirectory() {
  const cd = dirname(fileURLToPath(import.meta.url));
  return join(cd, '../../..');
}

async function getIgnorer(rootDir) {
  return gitignoreParser.compile(`
    ${await readFile(resolve(rootDir, '.gitignore'))}
    ${await readFile(resolve(rootDir, '.ffignore'))}
  `);
}

async function addFilesToArchive(rootDir, archive, directoryPath, ignorer) {
  for (const itemName of await readdir(directoryPath)) {
    const itemPath = resolve(directoryPath, itemName);
    const relativePath = relative(rootDir, itemPath).replaceAll(sep, '/');
    if (ignorer.denies(relativePath)) continue;

    const itemInfo = await stat(itemPath);
    if (itemInfo.isDirectory()) {
      await addFilesToArchive(rootDir, archive, itemPath, ignorer);
    } else {
      archive.file(itemPath, { name: relativePath });
    }
  }
}

async function addProductionEnvironmentFilesToArchive(archive) {
  // Run under `varlock run`, which supplies the production values
  const websiteUrl = process.env.VITE_PUBLIC_WEBSITE_URL ?? '';
  const posthogKey = process.env.VITE_PUBLIC_POSTHOG_KEY ?? '';

  const content = `VITE_PUBLIC_WEBSITE_URL=${websiteUrl}
VITE_PUBLIC_POSTHOG_KEY=${posthogKey}`;
  archive.append(content, {
    name: 'apps/browser-extension/.env.production.local',
  });
}
