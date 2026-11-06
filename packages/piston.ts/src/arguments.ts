const QUOTES: Record<string, string> = { '"': '"', '“': '”' };

/** Split a command line into arguments, keeping quoted sections together. */
export function parseArguments(args?: string) {
  if (!args) return;

  const parsed: string[] = [];
  let current = '';
  let started = false;
  let closing: string | null = null;

  for (const char of args) {
    if (closing) {
      if (char === closing) closing = null;
      else current += char;
    } else if (char in QUOTES) {
      closing = QUOTES[char]!;
      started = true;
    } else if (/\s/.test(char)) {
      if (started) parsed.push(current);
      current = '';
      started = false;
    } else {
      current += char;
      started = true;
    }
  }

  if (started) parsed.push(current);
  return parsed;
}
