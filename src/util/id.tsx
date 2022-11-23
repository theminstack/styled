/* eslint-disable no-var */

import { getHashString, hash } from '../util/hash.js';

declare global {
  var $$rmsId: string;
}

if (!('$$rmsId' in globalThis)) {
  Object.defineProperty(globalThis, '$$rmsId', {
    configurable: false,
    enumerable: false,
    value: getHashString(hash('$$rmsId')),
    writable: true,
  });
}

const getId = () => {
  return '_rmss' + (globalThis.$$rmsId = getHashString(hash(globalThis.$$rmsId))) + '_';
};

export { getId };
