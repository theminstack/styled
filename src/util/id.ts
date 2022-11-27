/* eslint-disable no-var */

import { getHashString, hash } from './hash.js';

declare global {
  var $$rmsId: string;
}

const SEED = getHashString(hash('$$rmsId'));

if (!('$$rmsId' in globalThis)) {
  Object.defineProperty(globalThis, '$$rmsId', {
    configurable: false,
    enumerable: false,
    value: SEED,
    writable: true,
  });
}

const getId = () => {
  return '_rmss' + (globalThis.$$rmsId = getHashString(hash(globalThis.$$rmsId))) + '_';
};

const resetIds = () => {
  Object.assign(globalThis, { $$rmsId: SEED });
};

export { getId, resetIds };
