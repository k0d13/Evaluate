import Fuse from 'fuse.js';
import z from 'zod';
import { Callable } from './callable.ts';
import { type Client, FETCH } from './client.ts';
import {
  encodeRuntimeId,
  getRuntimeAliases,
  getRuntimeName,
  getRuntimePopularity,
  getRuntimeTags,
} from './getters.ts';

export const Runtime = z
  .object({
    language: z.string(),
    version: z.string(),
    runtime: z.string().optional(),
    aliases: z.string().array(),
  })
  .transform((r, ctx) => {
    const id = encodeRuntimeId(r.language, r.runtime);
    if (!id) {
      ctx.issues.push({ code: 'custom', message: 'Unsupported runtime', input: r });
      return z.NEVER;
    }

    return {
      id,
      /** The language as Piston knows it, needed to execute code. */
      language: r.language,
      name: getRuntimeName(id)!,
      version: r.version,
      aliases: getRuntimeAliases(id)!,
      popularity: getRuntimePopularity(id)!,
      tags: getRuntimeTags(id)!,
    };
  });

type Runtime = typeof Runtime._output;

const normalise = (value: string) => value.trim().toLowerCase();

function matchesExactly(runtime: Runtime, query: string) {
  return (
    runtime.id === query ||
    normalise(runtime.name) === query ||
    runtime.aliases.some((a) => normalise(a) === query)
  );
}

export class Runtimes extends Callable<(options?: { force?: boolean }) => Promise<Runtime[]>> {
  #runtimes: Runtime[] | null = null;
  #pending: Promise<Runtime[]> | null = null;
  #fuse: Fuse<Runtime> | null = null;

  constructor(client: Client) {
    super((options) => {
      if (this.#runtimes && options?.force !== true) return Promise.resolve(this.#runtimes);
      // Callers arriving while a request is in flight share it
      return (this.#pending ??= client[FETCH]('/runtimes', {})
        .then((r) => r.json())
        .then((json: unknown[]) => {
          // Piston supports more languages than Evaluate knows about, skip those
          const known = json.flatMap((item) => {
            const parsed = Runtime.safeParse(item);
            return parsed.success ? [parsed.data] : [];
          });
          const unique = [...new Map(known.reverse().map((rt) => [rt.id, rt])).values()].reverse();
          this.#fuse = null;
          return (this.#runtimes = unique);
        })
        .finally(() => (this.#pending = null)));
    });
  }

  /**
   * Find runtimes by name, alias or tag. Exact matches win and fuzzy matching is only used when
   * nothing matches exactly (unless `fuzzy` is off). Results are ordered by popularity.
   */
  async search(query: string | string[], { fuzzy = true }: { fuzzy?: boolean } = {}) {
    const queries = (Array.isArray(query) ? query : [query]).map(normalise).filter(Boolean);
    if (queries.length === 0) return [];

    const runtimes = await this();
    let found = runtimes.filter((rt) => queries.some((q) => matchesExactly(rt, q)));

    if (found.length === 0 && fuzzy) {
      const fuse = (this.#fuse ??= new Fuse(runtimes, {
        keys: ['name', 'aliases', 'tags'],
        threshold: 0.35,
      }));
      found = [...new Set(queries.flatMap((q) => fuse.search(q).map((r) => r.item)))];
    }

    return found.sort((a, b) => b.popularity - a.popularity);
  }

  async get(id: string) {
    return this().then((r) => r.find((r) => r.id === id));
  }
}
