import { type ExecuteResult, getRuntimeIdsFromExtension, type Runtime } from 'piston.ts';
import type { ProtocolWithReturn } from 'webext-bridge';
import { onMessage, sendMessage } from 'webext-bridge/background';
import browser from 'webextension-polyfill';
import piston from '#/services/piston.ts';
import posthog, { sessionLog } from '#/services/posthog.ts';

declare module 'webext-bridge' {
  export interface ProtocolMap {
    getSelectionInfo: ProtocolWithReturn<void, { code: string; hints: string[][] }>;
    unknownRuntime: ProtocolWithReturn<{ code: string }, void>;
    executionStarted: ProtocolWithReturn<{ runtimeNameOrCount: string | number }, void>;
    executionFailed: ProtocolWithReturn<{ errorMessage: string }, void>;
    executionFinished: ProtocolWithReturn<
      {
        code: string;
        runtimes: (typeof Runtime._output)[];
        results: (typeof ExecuteResult._output)[];
      },
      void
    >;
    getBackgroundSessionId: ProtocolWithReturn<void, string | undefined>;
  }
}

const MAX_RUNTIMES = 5;
/** Piston allows a handful of requests a second, so runs are started a little apart. */
const STAGGER = 250;

/** Hints that are file extensions stand for every runtime that uses them. */
function toQueries(hints: string[]) {
  return hints.flatMap((h) => (h.startsWith('.') ? getRuntimeIdsFromExtension(h) : h));
}

/** Try each group of hints from most to least trustworthy, then settle for a fuzzy match. */
async function findRuntimes(hints: string[][]) {
  for (const group of hints) {
    const found = await piston.runtimes.search(toQueries(group), { fuzzy: false });
    if (found.length) return found.slice(0, MAX_RUNTIMES);
  }
  return (await piston.runtimes.search(hints.flatMap(toQueries))).slice(0, MAX_RUNTIMES);
}

browser.action.setTitle({ title: 'Evaluate' });

browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    posthog?.capture('installed_extension');
  } else if (details.reason === 'update') {
    posthog?.capture('updated_extension');
  }
});

browser.contextMenus.create({
  id: 'runCodeSelection',
  title: 'Execute Code',
  contexts: ['selection'],
});

browser.action.onClicked.addListener(async () => {
  posthog?.capture('clicked_browser_action');
  browser.tabs.create({ url: import.meta.env.VITE_PUBLIC_WEBSITE_URL });
});

browser.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== 'runCodeSelection' || !tab?.id) return;

  posthog?.capture('clicked_context_menu_item', { $current_url: tab.url });
  const endpoint = `content-script@${tab.id}`;

  const { code, hints } = await sendMessage('getSelectionInfo', void 0, endpoint);
  const runtimes = await findRuntimes(hints);
  if (!runtimes.length) return sendMessage('unknownRuntime', { code }, endpoint);

  const runtimeNameOrCount = runtimes.length === 1 ? runtimes[0]!.name : runtimes.length;
  sendMessage('executionStarted', { runtimeNameOrCount }, endpoint);

  const settled = await Promise.allSettled(
    runtimes.map(async (runtime, i) => {
      await new Promise((r) => setTimeout(r, i * STAGGER));
      const [result, options] = await piston.execute(runtime, { code });
      posthog?.capture('executed_code', {
        runtime_id: runtime.id,
        code_length: options.length,
        code_lines: options.lines,
        compile_successful: result.compile?.success ?? null,
        execution_successful: result.success,
      });
      return result;
    }),
  );

  // Show whatever ran, and only complain when nothing did
  const finished = settled.flatMap((s, i) =>
    s.status === 'fulfilled' ? [{ runtime: runtimes[i]!, result: s.value }] : [],
  );
  if (!finished.length) {
    const reason = (settled[0] as PromiseRejectedResult).reason;
    const errorMessage = reason instanceof Error ? reason.message : 'Unknown error';
    return sendMessage('executionFailed', { errorMessage }, endpoint);
  }

  sendMessage(
    'executionFinished',
    {
      code,
      runtimes: finished.map((f) => f.runtime),
      results: finished.map((f) => f.result),
    },
    endpoint,
  );
});

onMessage('getBackgroundSessionId', () => {
  const sessionId = posthog?.get_session_id();
  sessionLog(sessionId);
  return sessionId;
});
