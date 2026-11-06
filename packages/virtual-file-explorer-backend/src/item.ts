import { Children } from './children.ts';
import { Emitter } from './emitter.ts';
import type { Folder } from './folder.ts';

/** Everything files and folders have in common. */
export abstract class Item {
  public abstract readonly type: 'file' | 'folder';
  public readonly changes = new Emitter();

  /**
   * Emits on this item, `child:` and `descendant:` on its ancestors. Folders also emit `parent:`
   * and `ancestor:` on their children.
   *
   * @internal
   */
  public _emit(event: string) {
    this.changes.emit(event);
    for (let a = this.parent; a; a = a.parent) {
      if (a === this.parent) a.changes.emit(`child:${event}`);
      a.changes.emit(`descendant:${event}`);
    }
  }

  public constructor(name = '') {
    this._name = name;
  }

  // === parent === //

  private _parent: Folder | null = null;
  public get parent() {
    return this._parent;
  }
  public set parent(parent: Folder | null) {
    if (parent === this._parent) return;
    if (parent && (parent === (this as Item) || parent.ancestors.includes(this as never)))
      throw new Error('A folder cannot be moved into itself');
    if (
      parent &&
      this._name &&
      parent.children.some((c) => (c as Item) !== this && c.name === this._name)
    )
      throw new Error('A child with that name already exists');

    const previous = this._parent;
    previous?.children.remove(this as never);
    parent?.children.push(this as never);
    this._parent = parent;
    for (const a of this.ancestors) a.expanded = true;

    previous?._emit('children');
    parent?._emit('children');
    this._emit('parent');
  }
  /** The topmost folder, or `null` for a file that is not in a folder. */
  public get root(): Folder | null {
    const top = this.ancestors.at(-1) ?? this;
    return top.type === 'folder' ? (top as Folder) : null;
  }
  /** Every folder above this item, nearest first. */
  public get ancestors() {
    const ancestors = new Children<Folder>();
    for (let a = this.parent; a; a = a.parent) ancestors.push(a);
    return ancestors;
  }

  // === name === //

  private _name: string;
  public get name() {
    return this._name;
  }
  public set name(name: string) {
    if (name === this._name) return;
    if (name && this.parent?.children.some((c) => (c as Item) !== this && c.name === name))
      throw new Error('A child with that name already exists');
    this._name = name;
    this._emit('name');
  }

  // === path === //

  public abstract get path(): string;

  // === selected === //

  private _selected = false;
  public get selected() {
    return this._selected;
  }
  public set selected(selected: boolean) {
    if (this._selected === selected) return;
    if (selected) {
      for (const a of this.ancestors) a.expanded = true;
      for (const d of this.root?.lineage ?? []) d.selected = false;
    }
    this._selected = selected;
    this._emit('selected');
  }
  public select() {
    this.selected = true;
    return this;
  }
  public deselect() {
    if (this.root) this.root.selected = true;
    this.selected = false;
    return this;
  }
}
