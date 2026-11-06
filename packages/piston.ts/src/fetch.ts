const MAX_RETRIES = 3;
const TIMEOUT = 10_000;
const MAX_DELAY = 10_000;

export class PistonError extends Error {
  override name = 'PistonError';
  /** HTTP status, or `null` when no response was received. */
  status: number | null;

  constructor(message: string, status: number | null, options?: ErrorOptions) {
    super(message, options);
    this.status = status;
  }
}

function retryDelay(response: Response, attempt: number) {
  const seconds = Number(response.headers.get('retry-after'));
  const delay = seconds > 0 ? seconds * 1000 : 2 ** (attempt + 1) * 1000;
  return Math.min(delay, MAX_DELAY);
}

async function errorMessage(response: Response) {
  const body = await response.json().catch(() => null);
  const detail = typeof body?.message === 'string' ? `: ${body.message}` : '';
  return `Piston responded with ${response.status}${detail}`;
}

/** Fetch with a per-attempt timeout, rate limit retries and typed errors. */
export async function betterFetch(input: string, init?: RequestInit) {
  for (let attempt = 0; ; attempt++) {
    let response: Response;
    try {
      response = await fetch(input, { ...init, signal: AbortSignal.timeout(TIMEOUT) });
    } catch (error) {
      const timedOut = error instanceof Error && error.name === 'TimeoutError';
      const message = timedOut ? 'Piston took too long to respond' : 'Could not reach Piston';
      throw new PistonError(message, null, { cause: error });
    }

    if (response.ok) return response;

    if (response.status === 429) {
      if (attempt >= MAX_RETRIES)
        throw new PistonError('Too many requests', 429, { cause: response });
      await new Promise((r) => setTimeout(r, retryDelay(response, attempt)));
      continue;
    }

    throw new PistonError(await errorMessage(response), response.status, { cause: response });
  }
}
