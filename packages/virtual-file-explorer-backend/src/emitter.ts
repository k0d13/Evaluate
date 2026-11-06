type Listener = () => void;

/**
 * A minimal event emitter. Events look like `name` or `scope:name`, and listening to `*:name`
 * matches the `name` event of every scope.
 */
export class Emitter {
  #listeners = new Map<string, Set<Listener>>();

  on(event: string, listener: Listener) {
    const listeners = this.#listeners.get(event) ?? new Set();
    this.#listeners.set(event, listeners.add(listener));
    return this;
  }

  off(event: string, listener: Listener) {
    const listeners = this.#listeners.get(event);
    if (listeners?.delete(listener) && listeners.size === 0) this.#listeners.delete(event);
    return this;
  }

  /** Whether anything is listening, lets callers skip work nobody would see. */
  get active() {
    return this.#listeners.size > 0;
  }

  emit(event: string) {
    if (!this.active) return;

    const scope = event.indexOf(':');
    const wildcard = scope === -1 ? null : `*${event.slice(scope)}`;
    for (const name of [event, wildcard]) {
      // A copy, so listeners can unsubscribe while this runs
      const listeners = Array.from(this.#listeners.get(name!) ?? []);
      for (const listener of listeners) listener();
    }
  }
}
