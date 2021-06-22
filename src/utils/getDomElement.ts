import { assign } from './assign';

export type DomElement<TTag extends keyof HTMLElementTagNameMap> = HTMLElementTagNameMap[TTag] & {
  /**
   * Append this element to the end of the `parent` element children.
   */
  mount(parent: Node): DomElement<TTag>;
  /**
   * Remove this element from its parent. Does nothing if the
   * element does not have a parent.
   */
  unmount(): DomElement<TTag>;
};

/**
 * Create a DOM element ({@link HTMLElement}) with optional configuration.
 */
export function getDomElement<TTag extends keyof HTMLElementTagNameMap>(
  tag: TTag,
  configure?: (el: DomElement<TTag>) => void,
): DomElement<TTag> {
  const el: DomElement<TTag> = assign(document.createElement(tag), {
    mount(parent: Node): DomElement<TTag> {
      return parent.appendChild(el);
    },
    unmount(): DomElement<TTag> {
      return el.parentNode?.removeChild(el) ?? el;
    },
  });

  configure?.(el);

  return el;
}
