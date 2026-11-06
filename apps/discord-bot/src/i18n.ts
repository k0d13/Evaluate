import { createWithSay } from '@saykit/carbon';
import { createCatalogue } from 'saykit';
import en from './locales/en.js';

export const catalogue = createCatalogue({ en });

export const withSay = createWithSay(catalogue);
