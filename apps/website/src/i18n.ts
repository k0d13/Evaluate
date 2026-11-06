import 'server-only';
import { createWithSay } from '@saykit/react/server';
import { createCatalogue } from 'saykit';
import en from './locales/en.js';

export const catalogue = createCatalogue({ en });

export const withSay = createWithSay(catalogue);

/** Resolves the locale of a route segment from its `[locale]` param. */
export const localeOf = (props: { params: Promise<{ locale: string }> }) =>
  props.params.then((params) => params.locale);
