import { useLayoutEffect, useMemo } from 'react';
import { isClient } from '../constants';
import { Tokens } from '../types/Tokens';
import { getDynamicClassName } from '../utils/getDynamicClassName';
import { getStyleTokens } from '../utils/getStyleTokens';

type CacheItem = { styleTokens: Tokens; refCount: number };

export const _styleTokensCache: Record<string, CacheItem | undefined> = Object.create(null);

/**
 * Get the tokens and class name for a style, including tokens
 * inherited from injected class names.
 */
export function useStyleTokens(
  styleText: string,
  className: string | undefined,
  displayName: string | undefined,
): { styleTokens: Tokens; dynamicClassName: string; otherClassNames: string[] } {
  const { styleTokens, dynamicClassName, otherClassNames } = useMemo(() => {
    const { styleTokens, otherClassNames } = (className ?? '')
      .trim()
      .split(/\s+/g)
      .reduce<{ otherClassNames: string[]; styleTokens: Tokens }>(
        (acc, singleClassName) => {
          if (!singleClassName) {
            return acc;
          }

          const classTokens = _styleTokensCache[singleClassName]?.styleTokens;

          return classTokens
            ? { otherClassNames: acc.otherClassNames, styleTokens: [...acc.styleTokens, ...classTokens] }
            : { otherClassNames: [...acc.otherClassNames, singleClassName], styleTokens: acc.styleTokens };
        },
        { styleTokens: getStyleTokens(styleText), otherClassNames: [] },
      );
    const dynamicClassName = getDynamicClassName(styleTokens, displayName);

    return { styleTokens, dynamicClassName, otherClassNames };
  }, [styleText, className, displayName]);

  // Adds the cache entry early (before effects) so that it will
  // be available to children immediately. This is technically a
  // violation of the React function component contract because
  // any side effects should be limited to effects. However,
  // this side effect is idempotent, and an additional step is
  // taken to revert the change (using requestAnimationFrame),
  // if React does not commit the change.
  if (!_styleTokensCache[dynamicClassName]) {
    _styleTokensCache[dynamicClassName] = { styleTokens, refCount: 0 };
  }

  // Use ref counting on the client. For SSR, styles are only
  // mounted (never unmounted), so ref counting is not necessary.
  if (isClient) {
    let abortedRenderCleanup: number | undefined;

    // If the style cache entry is new, schedule a cleanup in case
    // the render is aborted.
    if (_styleTokensCache[dynamicClassName]?.refCount === 0) {
      abortedRenderCleanup = requestAnimationFrame(() => {
        if (_styleTokensCache[dynamicClassName]?.refCount === 0) {
          delete _styleTokensCache[dynamicClassName];
        }
      });
    }

    // When the render is committed, cancel the aborted render
    // cleanup.
    useLayoutEffect(() => {
      if (abortedRenderCleanup != null) {
        cancelAnimationFrame(abortedRenderCleanup);
      }
    }, [abortedRenderCleanup]);

    // Increment the ref count for the given style on mount, and
    // decrement it on unmount.
    useLayoutEffect(() => {
      (_styleTokensCache[dynamicClassName] as CacheItem).refCount++;

      return () => {
        if (--(_styleTokensCache[dynamicClassName] as CacheItem).refCount <= 0) {
          delete _styleTokensCache[dynamicClassName];
        }
      };
    }, [dynamicClassName]);
  }

  return { styleTokens, dynamicClassName, otherClassNames };
}
