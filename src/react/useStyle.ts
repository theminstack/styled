import { createElement, ReactElement, useLayoutEffect } from 'react';
import { isClient, styledElementAttribute } from '../constants';
import { DomElement, getDomElement } from '../utils/getDomElement';
import { useStyleConfig } from './useStyleConfig';

export const _keyCounts: Record<string, number | undefined> = Object.create(null);

function getStyleElement(key: string, cssText: string): DomElement<'style'> {
  return getDomElement('style', (el) => {
    el.setAttribute(styledElementAttribute, key);
    el.textContent = cssText;
  });
}

function useClientStyle(key: string, cssText: string): null {
  const { clientManager: manager } = useStyleConfig();

  useLayoutEffect(() => {
    const refCount = (_keyCounts[key] = (_keyCounts[key] ?? 0) + 1);

    if (refCount === 1) {
      manager.add(key, getStyleElement(key, cssText));
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

function useServerStyle(key: string, cssText: string): ReactElement | null {
  const { serverManager: manager } = useStyleConfig();
  const refCount = (_keyCounts[key] = (_keyCounts[key] ?? 0) + 1);

  if (refCount !== 1) {
    return null;
  }

  if (manager) {
    manager.add(key, getStyleElement(key, cssText));
    return null;
  }

  return createElement('style', { [styledElementAttribute]: '' }, cssText);
}

/**
 * Inject a unique `<style>` element. My return the element for
 * inlining during SSR. Tracks use of unique style (by ID) so that
 * they are only mounted once, and unmounted when no longer used.
 */
export const useStyle = isClient ? useClientStyle : useServerStyle;
