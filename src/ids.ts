import { environment } from './environment';
import { getHash } from './hash';

interface Ids {
  next: (namespace: string) => string;
}

function createIds(): Ids {
  const counters = new Map<string, number>();

  return {
    next: (namespace) => {
      const count = counters.get(namespace) ?? 0;
      counters.set(namespace, count + 1);
      return 'tss_' + (environment.isTest ? '<hash>' : getHash(count.toString(10), namespace));
    },
  };
}

export { type Ids, createIds };
