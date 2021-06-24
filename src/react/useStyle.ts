import { createElement, ReactElement, useLayoutEffect } from 'react';
import { useStyleConfig } from './useStyleConfig';
import { isClient, styledElementAttribute } from '../constants';
import { IStyle } from '../types/IStyle';

export const _keyCounts: Record<string, number | undefined> = Object.create(null);

function useClientStyle({ key, cssText }: IStyle): null {
  const { clientManager: manager } = useStyleConfig();

  useLayoutEffect(() => {
    const refCount = (_keyCounts[key] = (_keyCounts[key] ?? 0) + 1);

    if (refCount === 1) {
      manager.add({ key, cssText });
    }

    return () => {
      requestAnimationFrame(() => {
        const refCount = (_keyCounts[key] = Math.max(0, (_keyCounts[key] ?? 0) - 1));

        if (refCount === 0) {
          manager.remove(key);
        }
      });
    };
  }, [manager, key, cssText]);

  return null;
}

function useServerStyle({ key, cssText }: IStyle): ReactElement | null {
  const { serverManager: manager } = useStyleConfig();
  const refCount = (_keyCounts[key] = (_keyCounts[key] ?? 0) + 1);

  if (refCount !== 1) {
    return null;
  }

  if (manager) {
    manager.add({ key, cssText });
    return null;
  }

  return createElement('style', { [styledElementAttribute]: '' }, cssText);
}

/**
 * Inject a unique `<style>` element. My return the element for
 * inlining during SSR. Tracks use of unique style (by key) so that
 * they are only mounted once, and unmounted when no longer used.
 */
export const useStyle = isClient ? useClientStyle : useServerStyle;
