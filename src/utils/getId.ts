import { getHash } from './getHash';
import { getCssIdentifier } from './getCssIdentifier';
import { isTest } from '../constants';
import { version } from '../../package.json';
import { RefManagerVoid } from './RefManagerVoid';

export const _refs = new RefManagerVoid();

/**
 * Get a stable ID string which is safe to use as a CSS class name.
 *
 * _When `process.env.NODE_ENV` is "test" (eg. during Jest testing),
 * this function returns a stable value for the given display name.
 * This value is **NOT** unique per invocation like it would be at
 * runtime._
 */
export function getId(namespace: string): string {
  return `${getCssIdentifier(namespace)}-${getHash(
    ...(isTest ? [] : [version, _refs.require(namespace).count]),
    namespace,
  )}`;
}
