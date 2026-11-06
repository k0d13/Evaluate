import { Say } from '@saykit/react';
import { PlaygroundCardList } from '#/features/playgrounds/playground-card-list.tsx';
import { localeOf, withSay } from '#/i18n.ts';
import { generateBaseMetadata } from '#/lib/metadata.ts';
import piston from '#/services/piston.ts';

export async function generateMetadata({ params }: PageProps<'/[locale]/playgrounds'>) {
  const { locale } = await params;
  return generateBaseMetadata(locale, '/playgrounds');
}

async function PlaygroundsPage() {
  const runtimes = await piston.runtimes();

  return (
    <div className="container flex flex-col gap-6 py-6">
      <div className="space-y-6 py-24 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary md:text-5xl">
          <Say>Playgrounds</Say>
        </h1>
        <p className="text-sm text-balance md:text-base">
          <Say>Explore and run code in different programming languages and runtimes.</Say>
          <br />
          <span className="opacity-70">
            <Say>Powered by the Piston execution engine.</Say>
          </span>
        </p>
      </div>

      <PlaygroundCardList initialRuntimes={runtimes} />
    </div>
  );
}

export default withSay(PlaygroundsPage, localeOf);
