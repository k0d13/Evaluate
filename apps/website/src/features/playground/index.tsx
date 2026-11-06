'use client';

import { Children } from 'react';
import { useMediaQuery } from '#/hooks/media-query.ts';
import { DesktopWrapper } from './desktop.tsx';
import { MobileWrapper } from './mobile.tsx';
import { EditorWrapperSkeleton } from './skeleton.tsx';

export function EditorWrapper({ children }: React.PropsWithChildren) {
  if (Children.count(children) !== 3) throw new Error('Invalid children');
  const isDesktop = useMediaQuery('lg');

  if (isDesktop === undefined) return <EditorWrapperSkeleton />;
  if (isDesktop) return <DesktopWrapper>{children}</DesktopWrapper>;
  return <MobileWrapper>{children}</MobileWrapper>;
}
