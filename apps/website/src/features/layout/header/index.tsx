'use client';

import { Button } from '@evaluate/components/button';
import { Sheet, SheetBody, SheetTrigger } from '@evaluate/components/sheet';
import { Say } from '@saykit/react';
import { MenuIcon } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import type React from 'react';
import { Children, useCallback, useState } from 'react';
import { twMerge as cn } from 'tailwind-merge';
import { LocalisedLink } from '#/components/localised-link.tsx';
import { useMediaQuery } from '#/hooks/media-query.ts';
import { DiscordIcon } from './discord-icon.tsx';
import { GithubIcon } from './github-icon.tsx';
import { LocaleSwitcher } from './locale-switcher.tsx';
import { ThemeSwitcher } from './theme-switcher.tsx';

export function Header() {
  const isDesktop = useMediaQuery('lg');
  const Nav = isDesktop ? DesktopNavigationWrapper : MobileNavigationWrapper;

  const [open, setOpen] = useState(false);
  const closeByLink = useCallback(() => {
    setTimeout(() => setOpen(false), 100);
    return true;
  }, []);

  const isFullWidth = 'playground' in useParams();

  return (
    <header className={cn('h-14 w-full px-4', !isFullWidth && 'container')}>
      <Nav open={open} setOpen={setOpen}>
        <LocalisedLink href="/" className="flex items-center justify-center gap-1">
          <Image
            src="/images/icon.png"
            alt="Evaluate Logo"
            width={32}
            height={32}
            className="inline"
          />
          <span className="text-xl font-bold text-primary">Evaluate</span>
        </LocalisedLink>

        <div>
          <Button variant="ghost" onClick={closeByLink} asChild>
            <LocalisedLink href="/playgrounds">
              <Say>Playgrounds</Say>
            </LocalisedLink>
          </Button>

          <Button variant="ghost" onClick={closeByLink} className="relative" asChild>
            <LocalisedLink href="/products/browser-extension">
              <Say>Browser Extension</Say>
              <span className="absolute top-0 left-[5.8rem] text-xs text-primary">
                <Say>new</Say>
              </span>
            </LocalisedLink>
          </Button>

          <Button variant="ghost" onClick={closeByLink} asChild>
            <LocalisedLink href="/products/discord-bot">
              <Say>Discord Bot</Say>
            </LocalisedLink>
          </Button>
        </div>

        <div>
          <Button variant="ghost" size="icon" asChild>
            <a href="https://discord.gg/TUskQz75F6" target="_blank" rel="noreferrer">
              <DiscordIcon className="size-4" />
            </a>
          </Button>

          <Button variant="ghost" size="icon" asChild>
            <a href="https://github.com/apteryxxyz/Evaluate" target="_blank" rel="noreferrer">
              <GithubIcon className="size-4" />
            </a>
          </Button>

          <ThemeSwitcher />
          <LocaleSwitcher />
        </div>
      </Nav>
    </header>
  );
}

function DesktopNavigationWrapper(p: React.PropsWithChildren) {
  return (
    <nav
      className={cn(
        'flex h-full w-full items-center',
        '[&>div]:first-of-type:pl-3',
        '[&>div]:last-of-type:ml-auto',
      )}
    >
      {p.children}
    </nav>
  );
}

function MobileNavigationWrapper(
  p: React.PropsWithChildren<{
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }>,
) {
  return (
    <div className="flex h-full w-full items-center">
      {Children.toArray(p.children)[0]}

      <Sheet open={p.open} onOpenChange={p.setOpen}>
        <SheetTrigger asChild>
          <Button size="icon" variant="secondary" className="ml-auto aspect-square">
            <MenuIcon className="size-4" />
            <span className="sr-only">
              <Say>Toggle Mobile Navigation</Say>
            </span>
          </Button>
        </SheetTrigger>

        <SheetBody
          side="right"
          className="border-l-0 bg-transparent"
          onClick={() => p.setOpen(false)}
        >
          <div className="h-full rounded-xl border-2 bg-card p-3">
            <nav
              className={cn(
                'flex h-full flex-col gap-3',
                '[&>div]:first-of-type:flex [&>div]:first-of-type:flex-col [&>*]:[&>div]:first-of-type:justify-start',
                '[&>div]:last-of-type:mt-auto [&>div]:last-of-type:rounded-xl [&>div]:last-of-type:border',
              )}
            >
              {p.children}
            </nav>
          </div>
        </SheetBody>
      </Sheet>
    </div>
  );
}
