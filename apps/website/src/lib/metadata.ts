import { merge } from 'es-toolkit/object';
import type { Metadata } from 'next';
import type { View } from 'saykit';
import { defaultLocale } from '#/config.ts';
import { catalogue } from '#/i18n.ts';

export const SITE_NAME = 'Evaluate';

/** The path of a page in a locale, the default locale has no prefix */
export function localisedPath(locale: string, pathname: `/${string}`) {
  return locale === defaultLocale ? pathname : `/${locale}${pathname}`;
}

/**
 * Strips invisible format characters, such as the bidi isolates saykit writes around values, which
 * only belong in the page
 */
export const plain = (text: string) => text.replace(/\p{Cf}/gu, '');

export async function generateBaseMetadata(
  locale: string,
  pathname: `/${string}`,
  overrides?: (say: View) => Metadata,
  {
    /**
     * Whether to use the site wide card, pages with an opengraph-image file of their own turn it
     * off
     */
    defaultImage = true,
  } = {},
) {
  const say = await catalogue.load(catalogue.match(locale));
  const merged = merge(
    {
      title: SITE_NAME,
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
  const metadata = {
    ...merged,
    title: typeof merged.title === 'string' ? plain(merged.title) : merged.title,
    description: merged.description && plain(merged.description),
    keywords: [merged.keywords ?? []].flat().map(plain),
  };

  return {
    ...metadata,
    openGraph: {
      type: 'website',
      title: metadata.title ?? undefined,
      description: metadata.description ?? undefined,
      locale: say.locale,
      alternateLocale: catalogue.locales.filter((l) => l !== say.locale),
      siteName: SITE_NAME,
      url: localisedPath(say.locale, pathname),
      ...(defaultImage && {
        images: [
          {
            url: `/${say.locale}/opengraph-image`,
            width: 1200,
            height: 630,
            alt: `${SITE_NAME}, run code in any programming language`,
          },
        ],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: metadata.title ?? undefined,
      description: metadata.description ?? undefined,
      site: '@evaluatedotrun',
      creator: '@apteryxxyz',
    },
    alternates: {
      canonical: localisedPath(say.locale, pathname),
      languages: {
        ...Object.fromEntries(catalogue.locales.map((l) => [l, localisedPath(l, pathname)])),
        'x-default': localisedPath(defaultLocale, pathname),
      },
    },
  } satisfies Metadata;
}
