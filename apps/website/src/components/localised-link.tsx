'use client';

import { useSay } from '@saykit/react/client';
import Link from 'next/link';
import { defaultLocale } from '#/config.ts';

export function LocalisedLink({
  href,
  ...props
}: React.ComponentProps<typeof Link> & { locale?: string }) {
  const say = useSay();
  if (say.locale !== defaultLocale) href = `/${say.locale}${href}`;
  return <Link {...props} href={href} />;
}
