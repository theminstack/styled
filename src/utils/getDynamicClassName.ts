import { Tokens } from '../types/Tokens';
import { getHash } from './getHash';

export function getDynamicClassName(styleTokens: Tokens, namespace: string | undefined): string {
  return `_${getHash(...styleTokens, namespace ?? '')}`;
}
