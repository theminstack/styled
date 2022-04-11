import { createBrowserContext } from './browser-context';
import { environment } from './environment';
import { type Ids, createIds } from './ids';
import { createServerContext } from './server-context';
import { type StyleStringCache, createStyleStringCache } from './style-string-cache';
import { type StyledComponentCache, createStyledComponentCache } from './styled-component-cache';
import { type Stylesheet } from './stylesheet';
import { type StylesheetCollection, createStylesheetCollection } from './stylesheet-collection';

const $$tssContext = Symbol.for('$$tssContext');

declare const global: {};
declare const window: { document: Document };

interface Context {
  readonly ids: Ids;
  readonly stylesheetCollection: StylesheetCollection;
  readonly styleStringCache: StyleStringCache;
  readonly styledComponentCache: StyledComponentCache;
  reset: () => void;
  createStylesheet: () => Stylesheet;
  useLayoutEffect: (cb: () => (() => void) | void, deps?: unknown[]) => void;
  rehydrate?: () => void;
}

interface Global {
  [$$tssContext]?: Context;
}

const globalObject = (typeof window !== undefined ? window : typeof global !== 'undefined' ? global : {}) as Global;
const context: Context =
  globalObject[$$tssContext] ??
  (globalObject[$$tssContext] = {
    ...(environment.isBrowser && !environment.isTest ? createBrowserContext() : createServerContext()),
    ids: createIds(),
    stylesheetCollection: createStylesheetCollection(),
    styleStringCache: createStyleStringCache(),
    styledComponentCache: createStyledComponentCache(),
    reset: () => {
      Object.assign(context, {
        stylesheetCollection: createStylesheetCollection(),
        styleStringCache: createStyleStringCache(),
        styledComponentCache: createStyledComponentCache(),
      });
    },
  });

/**
 * Get a stable ID string which is safe to use as a CSS identifier.
 *
 * ```tsx
 * const id = getId('namespace');
 * ```
 *
 * **Note**: When `process.env.NODE_ENV` is "test" (eg. during Jest testing),
 * this function returns a stable value for the given display name. This value
 * is *NOT* unique per invocation like it would be at runtime.
 */
function getId(namespace: string): string {
  return context.ids.next(namespace);
}

function renderStylesToHtmlString(): string {
  return context.stylesheetCollection.toHtmlString();
}

context.rehydrate?.();

export { type Context, context, getId, renderStylesToHtmlString };
