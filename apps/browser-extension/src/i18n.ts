import { createCatalogue } from 'saykit';
import browser from 'webextension-polyfill';
import en from '../_locales/en/messages.js';

export const catalogue = createCatalogue({ en });

/** Resolved once per script, the UI language of the browser cannot change while it is running. */
export const say = catalogue.locale(catalogue.match(browser.i18n.getUILanguage()));
