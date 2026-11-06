import { notFound } from 'next/navigation';
import { Editor } from '#/features/editor/index.tsx';
import { Explorer } from '#/features/explorer/index.tsx';
import { ExplorerProvider } from '#/features/explorer/use.tsx';
import { EditorWrapper } from '#/features/playground/index.tsx';
import { breadcrumbs, JsonLd } from '#/features/seo/json-ld.tsx';
import { Terminal } from '#/features/terminal/index.tsx';
import { TerminalProvider } from '#/features/terminal/use.tsx';
import { localeOf, withSay } from '#/i18n.ts';
import { generateBaseMetadata, localisedPath } from '#/lib/metadata.ts';
import piston from '#/services/piston.ts';

export async function generateStaticParams() {
  const runtimes = await piston.runtimes();
  return runtimes.map((r) => ({ playground: r.id }));
}

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/playgrounds/[playground]'>) {
  const { locale, playground } = await params;
  const runtime = await piston.runtimes.get(decodeURIComponent(playground));
  if (!runtime) notFound();

  return generateBaseMetadata(
    locale,
    `/playgrounds/${playground}`,
    (say) => ({
      title: say`${runtime.name} Online Playground on Evaluate`,
      description: say`Run ${runtime.name} and more code snippets online in your browser with Evaluate's code playground.`,
      keywords: [runtime.name, ...runtime.aliases, ...runtime.tags].map((k) => k.toLowerCase()),
    }),
    { defaultImage: false },
  );
}

async function EditorPage({ params }: PageProps<'/[locale]/playgrounds/[playground]'>) {
  const { locale, playground } = await params;
  const runtime = await piston.runtimes.get(decodeURIComponent(playground));
  if (!runtime) notFound();
  const url = (path: `/${string}`) =>
    new URL(localisedPath(locale, path), process.env.WEBSITE_URL!).href;

  return (
    <>
      <JsonLd
        data={breadcrumbs([
          { name: 'Evaluate', url: url('/playgrounds') },
          { name: runtime.name, url: url(`/playgrounds/${playground}`) },
        ])}
      />
      <style>{`
        body{overflow-y:hidden!important;}
        body[data-scroll-locked]{margin-right:0px!important;}
      `}</style>
      <div className="m-1.5 mt-0 h-[calc(-3.5rem_+_100vh_-_12px)] lg:h-[calc(-3.5rem_+_100vh_-_6px)]">
        <ExplorerProvider runtime={runtime}>
          <TerminalProvider>
            <EditorWrapper>
              <Explorer />
              <Editor runtime={runtime} />
              <Terminal runtime={runtime} />
            </EditorWrapper>
          </TerminalProvider>
        </ExplorerProvider>
      </div>
    </>
  );
}

export default withSay(EditorPage, localeOf);
