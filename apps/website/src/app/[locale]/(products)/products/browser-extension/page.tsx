import { Button } from '@evaluate/components/button';
import { Say } from '@saykit/react';
import Link from 'next/link';
import { BrowserIcon } from '#/features/products/browser-icon.tsx';
import { ImageCarousel } from '#/features/products/image-carousel.tsx';
import { localeOf, withSay } from '#/i18n.ts';
import { generateBaseMetadata } from '#/lib/metadata.ts';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/products/browser-extension'>) {
  const { locale } = await params;
  return generateBaseMetadata(locale, '/products/browser-extension', (say) => ({
    title: say`Browser Extension | Evaluate`,
    description: say`Run code snippets on any website with the Evaluate browser extension, with over 70 supported languages.`,
  }));
}

function BrowserExtensionPlatformPage() {
  return (
    <div className="container grid grid-cols-1 gap-6 py-6 pt-[20vh] lg:grid-cols-2">
      <div className="flex flex-col items-center justify-center gap-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
          <Say>
            The <span className="text-primary">Evaluate</span> Browser Extension
          </Say>
        </h1>
        <p className="mx-auto max-w-5xl text-sm text-balance md:text-base">
          <Say>
            When you stumble upon code snippets while browsing the web, wouldn't it be great to
            execute them instantly? Look no further, the Evaluate extension is your solution, with
            its over 70 supported languages and quick code execution capabilities.
          </Say>
        </p>

        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center justify-center gap-2">
            <Button variant="secondary" className="flex items-center gap-2 rounded-full" asChild>
              <Link href="https://go.evaluate.run/chrome-extension" target="_blank">
                <BrowserIcon name="chrome" />
                <span>
                  <Say>
                    Evaluate for <span className="font-bold">Chrome</span>
                  </Say>
                </span>
              </Link>
            </Button>

            <Button
              title="Evaluate for Edge"
              size="icon"
              variant="secondary"
              className="flex items-center gap-3 rounded-full"
              asChild
            >
              <Link href="https://go.evaluate.run/chrome-extension?for=edge" target="_blank">
                <BrowserIcon name="edge" />
              </Link>
            </Button>

            <Button
              title="Evaluate for Opera"
              size="icon"
              variant="secondary"
              className="flex items-center gap-3 rounded-full"
              asChild
            >
              <Link href="https://go.evaluate.run/chrome-extension?for=opera" target="_blank">
                <BrowserIcon name="opera" />
              </Link>
            </Button>

            <Button
              title="Evaluate for Brave"
              size="icon"
              variant="secondary"
              className="flex items-center gap-3 rounded-full"
              asChild
            >
              <Link href="https://go.evaluate.run/chrome-extension?for=brave" target="_blank">
                <BrowserIcon name="brave" />
              </Link>
            </Button>
          </div>
        </div>

        <div>
          <Button variant="secondary" className="flex items-center gap-2 rounded-full" asChild>
            <Link href="https://go.evaluate.run/firefox-extension" target="_blank">
              <BrowserIcon name="firefox" />
              <span>
                <Say>
                  Evaluate for <span className="font-bold">Firefox</span>
                </Say>
              </span>
            </Link>
          </Button>
        </div>
      </div>

      <div>
        <ImageCarousel />
      </div>
    </div>
  );
}

export default withSay(BrowserExtensionPlatformPage, localeOf);
