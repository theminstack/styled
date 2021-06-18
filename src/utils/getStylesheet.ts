import { createElement, ReactElement, useLayoutEffect, useRef } from 'react';
import { isBrowser, styleElementCacheKeyAttr } from '../constants';
import { useStyledConfig } from '../react/StyledConfig';

export interface IStylesheetProps {
  cacheKey: string;
  cssText: string;
}

/**
 * Get an appropriate stylesheet React element for the current
 * environment (browser or server).
 */
export function getStylesheet(props: IStylesheetProps): ReactElement {
  return createElement(isBrowser ? StylesheetBrowser : StylesheetServer, props);
}

function StylesheetBrowser({ cacheKey, cssText }: IStylesheetProps): null {
  const { clientManager: manager } = useStyledConfig();
  const cacheKeyRef = useRef<string>();

  useLayoutEffect(() => {
    if (cacheKey && cacheKey !== cacheKeyRef.current) {
      manager.register(cacheKey, cssText, cacheKeyRef.current);
    }

    cacheKeyRef.current = cacheKey;

    return cacheKey
      ? () => {
          requestAnimationFrame(() => manager.unregister(cacheKey));
        }
      : undefined;
  }, [manager, cacheKey, cssText]);

  return null;
}

function StylesheetServer({ cacheKey, cssText }: IStylesheetProps): ReactElement | null {
  const { serverManager: manager } = useStyledConfig();

  if (cssText) {
    if (!manager) {
      return createElement('style', { [styleElementCacheKeyAttr]: cacheKey }, cssText);
    }

    manager.register(cacheKey, cssText, undefined);
  }

  return null;
}
