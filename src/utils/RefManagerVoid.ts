import { Ref } from './Ref';
import { RefManager } from './RefManager';

export class RefManagerVoid {
  private _manager = new RefManager<void>();

  require = (key: string): Ref<void> => {
    return this._manager.require(key, () => undefined);
  };

  clear = (): void => {
    this._manager.clear();
  };
}
