/** Words highlighters use when there is no real language. */
const NOT_A_LANGUAGE = new Set(['text', 'plain', 'plaintext', 'txt', 'none', 'nohighlight']);

/**
 * `language-js`, `lang-js`, `highlight-source-js` (GitHub, npm), `mw-highlight-lang-js`
 * (Wikipedia).
 */
const CLASS_LANGUAGE = /^(?:language|lang|highlight-source|mw-highlight-lang)-([\w+#.-]+)$/;
/** `jsHigh` (W3Schools). */
const CLASS_SUFFIX = /^(\w+?)high$/;
/** The language is the class after these, `brush: js` (MDN) and `hljs js` (Discord). */
const CLASS_BEFORE_LANGUAGE = new Set(['brush:', 'hljs']);
const LANGUAGE_ATTRIBUTES = ['data-language', 'data-lang'];
/** Wrappers around code often say which file it came from. */
const FILE_ATTRIBUTES = ['data-path', 'data-filename', 'data-file', 'data-tagsearch-path'];

/** Interpreters whose name is not a runtime alias. */
const INTERPRETERS: Record<string, string> = {
  node: 'javascript',
  nodejs: 'javascript',
  'ts-node': 'typescript',
  zsh: 'bash',
};

/** Unambiguous giveaways, only used when nothing else says what the language is. */
const SYNTAX: [RegExp, string][] = [
  [/^<\?php/, 'php'],
  [/^package main\b[\s\S]*\bfunc\b/m, 'go'],
  [/\bfn main\s*\(/, 'rust'],
  [/\bpublic static void main\s*\(/, 'java'],
  [/^\s*#include\s*<(?:iostream|vector|string|map|algorithm)>/m, 'c++'],
  [/^\s*#include\s*<(?:stdio|stdlib|string)\.h>/m, 'c'],
  [/^using System;/m, 'c#'],
  [/\bconsole\.log\(/, 'javascript'],
  [/^\s*puts\s+['"]/m, 'ruby'],
];

function languagesOf(element: Element) {
  const found = new Set<string>();
  const add = (value: string | null | undefined) => {
    const language = value?.trim().toLowerCase();
    if (language && !NOT_A_LANGUAGE.has(language)) found.add(language);
  };

  const classes = [...element.classList].map((c) => c.toLowerCase());
  classes.forEach((name, i) => {
    add(name.match(CLASS_LANGUAGE)?.[1] ?? name.match(CLASS_SUFFIX)?.[1]);
    if (CLASS_BEFORE_LANGUAGE.has(name)) add(classes[i + 1]);
  });
  for (const attribute of LANGUAGE_ATTRIBUTES) add(element.getAttribute(attribute));

  return [...found];
}

/** The extension of a file name as a `.ext` hint, the background script knows what uses it. */
function extensionOf(name: string | null | undefined) {
  const extension = name?.split(/[?#]/)[0]?.split('.').slice(1).pop();
  return extension ? [`.${extension.toLowerCase()}`] : [];
}

function interpreterOf(code: string) {
  const [, program, argument] = code.match(/^#!\s*(\S+)(?:\s+(?:-\S+\s+)*(\S+))?/) ?? [];
  if (!program) return [];

  const name = (program.endsWith('/env') ? argument : program)?.split('/').pop();
  const language = name?.toLowerCase().replace(/[\d.]+$/, '');
  return language ? [INTERPRETERS[language] ?? language] : [];
}

/**
 * Work out what language some selected code is written in, as groups of hints that are runtime
 * names, aliases or `.ext` file extensions. Groups are ordered from most to least trustworthy, and
 * the hints in a group are equally trustworthy.
 *
 * - Language markers on the selection or the closest element that has one
 * - The file the code came from, according to its wrapper or the page address
 * - A shebang
 * - Syntax that only one language uses
 */
export function detectRuntimeHints(selection: Selection | null, code: string, pageUrl: string) {
  const markers: string[][] = [];
  const files: string[][] = [];

  const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
  const container = range?.commonAncestorContainer;
  let element = container instanceof Element ? container : (container?.parentElement ?? null);

  for (; element && !['HTML', 'BODY'].includes(element.tagName); element = element.parentElement) {
    const languages = languagesOf(element);
    if (languages.length) markers.push(languages);

    for (const attribute of FILE_ATTRIBUTES) {
      const extension = extensionOf(element.getAttribute(attribute));
      if (extension.length) files.push(extension);
    }
  }

  const fromUrl = extensionOf(new URL(pageUrl).pathname.split('/').pop());
  if (fromUrl.length) files.push(fromUrl);

  const syntax = SYNTAX.filter(([pattern]) => pattern.test(code)).map(([, language]) => language);

  return [...markers, ...files, interpreterOf(code), syntax].filter((group) => group.length);
}
