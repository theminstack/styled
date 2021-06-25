export class Ref<TValue> {
  private _count = 0;

  get count(): number {
    return this._count;
  }

  constructor(public readonly key: string, public readonly value: TValue, private _onUnused: () => void) {}

  inc = (): number => {
    return ++this._count;
  };

  dec = (): number => {
    this._count = Math.max(0, this._count - 1);

    if (this._count === 0) {
      this._onUnused();
    }

    return this._count;
  };
}
