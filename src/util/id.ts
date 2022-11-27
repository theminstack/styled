/* eslint-disable no-var */

import { getHashString, hash } from './hash.js';
import { VERSION } from './version.js';

declare global {
  var $$rmsId: string;
}

const cache = new Map<string, { current: string }>();

const getId = (namespace = '') => {
  let entry = cache.get(namespace);
  if (!entry) cache.set(namespace, (entry = { current: getHashString(hash(VERSION + '/' + namespace)) }));
  return '_rmss' + (entry.current = getHashString(hash(entry.current))) + '_';
};

const resetIds = () => {
  cache.clear();
};

export { getId, resetIds };
