import type { File } from './file.ts';
import type { Folder } from './folder.ts';

export class Children<Of extends Folder | File = Folder | File> extends Array<Of> {
  public remove(item: Of) {
    const index = this.indexOf(item);
    if (index !== -1) this.splice(index, 1);
  }

  /** Sorts in place, folders first and then alphabetically. */
  public override sort() {
    return super.sort((a, b) => {
      if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  }
}
