import type { MetadataRoute } from 'next';
import { catalogue } from '#/i18n.ts';
import piston from '#/services/piston.ts';

const pages = [
  '/playgrounds',
  '/products/browser-extension',
  '/products/discord-bot',
  '/policies/privacy-policy',
  '/policies/terms-of-service',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const runtimes = await piston.runtimes();
  const paths = [...pages, ...runtimes.map((r) => `/playgrounds/${encodeURIComponent(r.id)}`)];
  const [defaultLocale = 'en'] = catalogue.locales;
  const url = (locale: string, path: string) =>
    new URL(locale === defaultLocale ? path : `/${locale}${path}`, process.env.WEBSITE_URL!).href;

  return paths.map((path) => ({
    url: url(defaultLocale, path),
    alternates: {
      languages: Object.fromEntries(catalogue.locales.map((l) => [l, url(l, path)])),
    },
  }));
}
