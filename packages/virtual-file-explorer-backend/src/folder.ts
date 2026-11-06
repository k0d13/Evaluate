import { Children } from './children.ts';
import type { File } from './file.ts';
import { Item } from './item.ts';

export class Folder extends Item {
  public readonly type = 'folder';

  public override _emit(event: string) {
    super._emit(event);

    const stack: Folder[] = [this];
    for (let folder = stack.pop(); folder; folder = stack.pop()) {
      for (const child of folder.children) {
        if (folder === this) child.changes.emit(`parent:${event}`);
        child.changes.emit(`ancestor:${event}`);
        if (child.type === 'folder') stack.push(child);
      }
    }
  }

  public get path(): string {
    if (this.name === '::root::') return '';
    return `${this.parent?.path ?? ''}${this.name}/`;
  }

  // === children === //

  public readonly children = new Children();
  /** Every item below this folder, direct children first and then each subfolder in turn. */
  public get descendants() {
    const descendants = new Children();
    const collect = (folder: Folder) => {
      for (const child of folder.children) descendants.push(child);
      for (const child of folder.children) if (child.type === 'folder') collect(child);
    };
    collect(this);
    return descendants;
  }
  public get lineage() {
    const lineage = new Children<Folder | File>();
    lineage.push(this);
    for (const descendant of this.descendants) lineage.push(descendant);
    return lineage;
  }

  // === expanded === //

  private _expanded = false;
  public get expanded() {
    return this._expanded;
  }
  public set expanded(expanded: boolean) {
    if (this._expanded === expanded) return;
    if (expanded) for (const a of this.ancestors) a.expanded = true;
    this._expanded = expanded;
    this._emit('expanded');
  }
  public expand() {
    this.expanded = true;
    return this;
  }
  public collapse() {
    this.expanded = false;
    return this;
  }
}
