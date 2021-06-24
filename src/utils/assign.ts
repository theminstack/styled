import { Assign } from '../types/Utilities';

/** Polyfill for `Object.assign` */
export function assign<TTarget extends {}, TProps extends Record<string, unknown>>(
  target: TTarget,
  props: TProps,
): TTarget & Assign<TTarget, TProps>;
export function assign(target: Record<string, unknown>, props: Record<string, unknown>): {} {
  for (const key of Object.keys(props)) {
    target[key] = props[key];
  }

  return target;
}
