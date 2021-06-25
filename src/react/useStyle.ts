import { createElement, ReactElement, useLayoutEffect } from 'react';
import { useStyleConfig } from './useStyleConfig';
import { isClient, styledElementAttribute } from '../constants';
import { IStyle } from '../types/IStyle';
import { RefManagerVoid } from '../utils/RefManagerVoid';

export const _refs = new RefManagerVoid();

function useClientStyle({ key, cssText }: IStyle): null {
  const { clientManager: manager } = useStyleConfig();

  useLayoutEffect(() => {
    const ref = _refs.require(key);

    if (ref.inc() === 1) {
      manager.add({ key, cssText });
    }

    return () => {
      requestAnimationFrame(() => {
        if (ref.dec() === 0) {
          manager.remove(key);
        }
      });
    };
  }, [manager, key, cssText]);

  return null;
}

function useServerStyle({ key, cssText }: IStyle): ReactElement | null {
  const { serverManager: manager } = useStyleConfig();
  const ref = _refs.require(key);

  if (ref.inc() !== 1) {
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
