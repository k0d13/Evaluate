import { SayProvider } from '@saykit/react/client';
import { getSay } from '@saykit/react/server';
import { cn } from 'cn';
import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import { Footer } from '#/features/layout/footer/index.tsx';
import { Header } from '#/features/layout/header/index.tsx';
import { BodyProviders, HtmlProviders } from '#/features/layout/providers.tsx';
import { catalogue, localeOf, withSay } from '#/i18n.ts';
import '#/style.css';

const inter = Inter({ subsets: ['latin'] });

export function generateStaticParams() {
  return catalogue.locales.map((l) => ({ locale: l }));
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
          <meta name="theme-color" content="#2fc186" />
          <link rel="icon" type="image/png" href="/favicon.ico" />
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
