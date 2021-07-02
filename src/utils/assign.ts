/**
 * Polyfill for `Object.assign`.
 */
export function assign<TSource extends {}, TTarget extends {}>(target: TSource, source: TTarget): TSource & TTarget {
  for (const key of Object.keys(source)) {
    (target as Record<string, any>)[key] = source[key as keyof TTarget];
  }

  return target as TSource & TTarget;
}
