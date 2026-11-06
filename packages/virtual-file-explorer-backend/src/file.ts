import { Item } from './item.ts';

export class File extends Item {
  public readonly type = 'file';

  public get path(): string {
    return `${this.parent?.path ?? ''}${this.name}`;
  }

  // === content === //

  private _content = '';
  public get content() {
    return this._content;
  }
  public set content(content: string) {
    if (this._content === content) return;
    this._content = content;
    this._emit('content');
  }

  // === entry === //

  /** Whether this is the file that gets run. Plain state, it does not emit. */
  public entry = false;

  // === opened === //

  private _opened = false;
  public get opened() {
    return this._opened;
  }
  public set opened(opened: boolean) {
    if (this._opened === opened) return;
    this._opened = opened;
    this._emit('opened');
  }
  public open() {
    this.opened = true;
    return this;
  }
  public close() {
    this.opened = false;
    return this;
  }

  // === focused === //

  private _focused = false;
  public get focused() {
    return this._focused;
  }
  public set focused(focused: boolean) {
    if (this._focused === focused) return;
    if (focused)
      for (const d of this.root?.descendants ?? []) if (d.type === 'file') d.focused = false;
    this._focused = focused;
    this._emit('focused');
  }
  public focus() {
    this.focused = true;
    return this;
  }
  public blur() {
    this.focused = false;
    return this;
  }
}
