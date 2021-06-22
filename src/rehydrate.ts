import { isClient, styledElementAttribute } from './constants';

/**
 * Move all SSR inlined `<style>` elements from the `<body>` to the
 * `<head>`.
 *
 * _This is a no-op if not used on the client (browser)._
 */
export function rehydrate(): void {
  if (!isClient) {
    return;
  }

  document.body.querySelectorAll<HTMLStyleElement>('style[' + styledElementAttribute + ']').forEach((element) => {
    document.head.appendChild(element);
  });
}
