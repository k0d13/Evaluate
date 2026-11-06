'use client';

import { Button } from '@evaluate/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@evaluate/components/dropdown-menu';
import { Say } from '@saykit/react';
import { LanguagesIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { locales } from '#/config.ts';

export function LocaleSwitcher() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <LanguagesIcon className="size-4" />
          <span className="sr-only">
            <Say>Change Language</Say>
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        {locales.map((locale) => (
          <DropdownMenuItem key={locale} className="cursor-pointer capitalize" asChild>
            <LocaleSwitcherItem locale={locale} />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function LocaleSwitcherItem({ locale, ...props }: { locale: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const localisedHref = useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);
    if (/^[a-z]{2}(-[A-Z]{2})?$/.test(segments[0]!)) segments[0] = locale;
    else segments.unshift(locale);
    return `/${segments.join('/')}${searchParams.size ? '?' : ''}${searchParams}`;
  }, [locale, pathname, searchParams]);

  const updatePreferredLocale = useCallback(() => {
    // update the locale cookie
    document.cookie = `preferred-locale=${locale}; max-age=31536000; path=/`;
  }, [locale]);

  return (
    <Link
      href={localisedHref}
      {...props}
      onClick={() => {
        updatePreferredLocale();
        router.push(localisedHref);
        return false;
      }}
    >
      {new Intl.DisplayNames([locale], { type: 'language' }).of(locale)}
    </Link>
  );
}
