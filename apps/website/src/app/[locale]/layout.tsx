import { SayProvider } from '@saykit/react/client';
import { getSay } from '@saykit/react/server';
import { cn } from 'cn';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import { Footer } from '#/features/layout/footer/index.tsx';
import { Header } from '#/features/layout/header/index.tsx';
import { BodyProviders, HtmlProviders } from '#/features/layout/providers.tsx';
import { JsonLd } from '#/features/seo/json-ld.tsx';
import { catalogue, localeOf, withSay } from '#/i18n.ts';
import { SITE_NAME } from '#/lib/metadata.ts';
import '#/style.css';

const inter = Inter({ subsets: ['latin'] });

export function generateStaticParams() {
  return catalogue.locales.map((l) => ({ locale: l }));
}

export const viewport: Viewport = { themeColor: '#2fc186' };

export function generateMetadata(): Metadata {
  return {
    metadataBase: new URL(process.env.WEBSITE_URL!),
    applicationName: SITE_NAME,
    manifest: '/manifest.webmanifest',
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: '48x48' },
        { url: '/icon.svg', type: 'image/svg+xml' },
      ],
      apple: '/apple-touch-icon.png',
    },
    robots: { 'max-image-preview': 'large' },
  };
}

async function RootLayout({ params, children }: LayoutProps<'/[locale]'>) {
  const { locale } = await params;
  if (!(catalogue.locales as readonly string[]).includes(locale)) notFound();
  const say = getSay();

  return (
    <HtmlProviders>
      <html
        key="html"
        lang={say.locale}
        dir={['ar', 'fa', 'he', 'ur', 'ps'].includes(say.locale) ? 'rtl' : 'ltr'}
        className="dark"
      >
        <head key="head">
          <meta name="evaluate-extension" content="disabled" />
          <meta name="darkreader-lock" />
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5722227635911083"
            crossOrigin="anonymous"
          />
        </head>

        <body
          key="body"
          className={cn(inter.className, 'flex min-h-screen flex-col overflow-y-scroll')}
        >
          <JsonLd
            data={[
              {
                '@type': 'WebSite',
                '@id': `${process.env.WEBSITE_URL}/#website`,
                name: SITE_NAME,
                url: process.env.WEBSITE_URL,
                inLanguage: say.locale,
              },
              {
                '@type': 'WebApplication',
                name: SITE_NAME,
                url: process.env.WEBSITE_URL,
                applicationCategory: 'DeveloperApplication',
                operatingSystem: 'Any',
                isAccessibleForFree: true,
                offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' },
              },
            ]}
          />
          <SayProvider>
            <BodyProviders>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </BodyProviders>
          </SayProvider>
        </body>
      </html>
    </HtmlProviders>
  );
}

export default withSay(RootLayout, localeOf);
