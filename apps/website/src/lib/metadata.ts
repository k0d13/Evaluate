import { merge } from 'es-toolkit/object';
import type { Metadata } from 'next';
import type { View } from 'saykit';
import { catalogue } from '#/i18n.ts';

export async function generateBaseMetadata(
  locale: string,
  pathname: `/${string}`,
  overrides?: (say: View) => Metadata,
) {
  const say = await catalogue.load(catalogue.match(locale));
  const metadata = merge(
    {
      title: 'Evaluate',
      description: say`Test code in any programming language with Evaluate! Run code snippets in your browser, without installing anything.`,
      keywords: [
        say`online playground`,
        say`code playground`,
        say`code sandbox`,
        say`online compiler`,
        say`online interpreter`,
      ],
    } satisfies Metadata,
    overrides?.(say) ?? {},
  );

  return {
    metadataBase: new URL(process.env.WEBSITE_URL!),
    ...metadata,
    openGraph: {
      type: 'website',
      title: metadata.title ?? undefined,
      description: metadata.description ?? undefined,
      locale: say.locale,
      alternateLocale: [...catalogue.locales],
      siteName: String(metadata.title ?? 'Evaluate'),
      url: new URL(`/${say.locale}${pathname}`, process.env.WEBSITE_URL!),
    },
    twitter: {
      card: 'summary',
      title: metadata.title ?? undefined,
      description: metadata.description ?? undefined,
      site: '@evaluatedotrun',
      creator: '@apteryxxyz',
    },
    alternates: {
      canonical: pathname,
      languages: catalogue.locales.reduce<Record<string, string>>((acc, locale) => {
        acc[locale] = `/${locale}${pathname}`;
        return acc;
      }, {}),
    },
  } satisfies Metadata;
}
