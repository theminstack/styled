import { useLayoutEffect, useMemo } from 'react';
import { isClient } from '../constants';
import { Tokens } from '../types/Tokens';
import { getDynamicClassName } from '../utils/getDynamicClassName';
import { getStyleTokens } from '../utils/getStyleTokens';
import { RefManager } from '../utils/RefManager';

export const _refs = new RefManager<Tokens>();

/**
 * Get the tokens and class name for a style, including tokens
 * inherited from injected class names.
 */
export function useStyleTokens(
  styleText: string,
  className: string | undefined,
  displayName: string | undefined,
  staticClassNames: Record<string, true>,
): { styleTokens: Tokens; dynamicClassName: string; staticClassName: string | null; otherClassNames: string[] } {
  const { styleTokens, dynamicClassName, staticClassName, otherClassNames } = useMemo(() => {
    const { styleTokens, staticClassName, otherClassNames } = (className ?? '')
      .trim()
      .split(/\s+/g)
      .reduce<{ otherClassNames: string[]; staticClassName: string | null; styleTokens: Tokens }>(
        (acc, singleClassName) => {
          if (!singleClassName) {
            return acc;
          }

          if (singleClassName in staticClassNames) {
            return !acc.staticClassName ? { ...acc, staticClassName: singleClassName } : acc;
          }

          const classTokens = _refs.get(singleClassName)?.value;

          return classTokens
            ? { ...acc, styleTokens: [...acc.styleTokens, ...classTokens] }
            : { ...acc, otherClassNames: [...acc.otherClassNames, singleClassName] };
        },
        { styleTokens: getStyleTokens(styleText), staticClassName: null, otherClassNames: [] },
      );
    const dynamicClassName = getDynamicClassName(styleTokens, displayName);

    return { styleTokens, dynamicClassName, staticClassName, otherClassNames };
  }, [styleText, className, displayName]);

  // Adds the cache entry early (before effects) so that it will
  // be available to children immediately. This is technically a
  // violation of the React function component contract because
  // any side effects should be limited to effects. However,
  // this side effect is idempotent, and an additional step is
  // taken to revert the change (using requestAnimationFrame),
  // if React does not commit the change.
  const ref = _refs.require(dynamicClassName, () => styleTokens);

  // Use ref counting on the client. For SSR, styles are only
  // mounted (never unmounted), so ref counting is not necessary.
  if (isClient) {
    // Make sure the cache item has at least one ref until the next
    // animation frame. This will also remove the cache entry if
    // the render was never committed.
    if (ref.count === 0) {
      ref.inc();
      requestAnimationFrame(ref.dec);
    }

    // Increment the ref count for the given style on mount, and
    // decrement it on unmount.
    useLayoutEffect(() => {
      ref.inc();

      return () => {
        ref.dec();
      };
    }, [ref]);
  }

  return { styleTokens, dynamicClassName, staticClassName, otherClassNames };
}
