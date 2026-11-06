import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from '#/features/seo/og-card.tsx';
import { catalogue } from '#/i18n.ts';

export const alt = 'Evaluate, run code in any programming language';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const say = await catalogue.load(catalogue.match(locale));

  return renderOgCard({
    title: say`Run code in any language`,
    subtitle: say`Online playgrounds for over 70 programming languages, with nothing to install.`,
  });
}
