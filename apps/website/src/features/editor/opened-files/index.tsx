'use client';

import type { File } from 'virtual-file-explorer-backend';
import { useExplorer, useWatch } from '#/features/explorer/use.tsx';
import { OpenedFileButton } from './button.tsx';

export function OpenedFiles() {
  const explorer = useExplorer();
  useWatch(explorer, ['*:focused', '*:opened']);
  const opened = explorer.descendants //
    .filter((f): f is File => f.type === 'file' && f.opened);

  return opened.map((f, _, o) => <OpenedFileButton key={f.path} file={f} others={o} />);
}
