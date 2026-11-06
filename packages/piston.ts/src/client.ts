import z from 'zod';
import { Execute } from './execute.ts';
import { betterFetch } from './fetch.ts';
import { Runtimes } from './runtimes.ts';

const ClientOptions = z.object({
  baseUrl: z.url().default('https://emkc.org/api/v2/piston'),
  apiKey: z.string().optional(),
});

export const FETCH = Symbol('GET');

export class Client {
  #options: typeof ClientOptions._output;

  constructor(options: typeof ClientOptions._input = {}) {
    this.#options = ClientOptions.parse(options);
  }

  [FETCH](path: `/${string}`, options: RequestInit) {
    const headers = new Headers(options.headers);
    if (this.#options.apiKey) headers.set('Authorization', this.#options.apiKey);
    return betterFetch(this.#options.baseUrl + path, { ...options, headers });
  }

  runtimes = new Runtimes(this);
  execute = new Execute(this);
}
