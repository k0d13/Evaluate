import type { IConfig } from 'next-sitemap';
import saykit from './saykit.config.ts';

export default {
  siteUrl: process.env.WEBSITE_URL!,
  generateIndexSitemap: false,

  transform: (_: unknown, pathname: string) => {
    if (!pathname.startsWith('/en/')) return undefined;
    return {
      loc: pathname.replace('/en/', '/'),
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.7,
      alternateRefs: saykit.locales.map((locale) => ({
        href: `${process.env.WEBSITE_URL!}/${locale}${pathname.replace('/en/', '/')}`,
        hreflang: locale,
      })),
    };
  },
} satisfies IConfig;
