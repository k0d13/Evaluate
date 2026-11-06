import { notFound } from 'next/navigation';
import { getRuntimeIconUrl } from 'piston.ts';
import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from '#/features/seo/og-card.tsx';
import { catalogue } from '#/i18n.ts';
import piston from '#/services/piston.ts';

export const alt = 'Evaluate online playground';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; playground: string }>;
}) {
  const { locale, playground } = await params;
  const runtime = await piston.runtimes.get(decodeURIComponent(playground));
  if (!runtime) notFound();
  const say = await catalogue.load(catalogue.match(locale));

  return renderOgCard({
    title: say`${runtime.name} Online Playground`,
    iconUrl: getRuntimeIconUrl(runtime.id) || undefined,
    subtitle: say`Write and run ${runtime.name} code in your browser, with nothing to install.`,
  });
}
