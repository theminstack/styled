import { Ref } from './Ref';

export class RefManager<TValue> {
  private _entries: Record<string, Ref<TValue> | undefined> = Object.create(null);

  require(key: string, factory: () => TValue): Ref<TValue> {
    let item = this._entries[key];

    if (!item) {
      item = new Ref<TValue>(key, factory(), () => {
        delete this._entries[key];
      });
      this._entries[key] = item;
    }

    return item;
  }

  get(key: string): Ref<TValue> | undefined {
    return this._entries[key];
  }

  clear(): void {
    this._entries = Object.create(null);
  }
}
