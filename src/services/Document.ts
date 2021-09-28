import { isTest } from '../utilities/isTest';
import { resetStyledStates } from './StyledState';

export type PartialElement<TElement extends PartialElement<any> = PartialElement<any>> = {
  textContent: string | null;
  readonly parentElement: TElement | null;
  readonly children: { [key: number]: TElement; length: number };
  setAttribute(qualifiedName: 'data-tss', value: string): void;
  insertAdjacentElement(where: 'beforebegin' | 'beforeend' | 'afterend', element: TElement): void;
  removeChild(child: any): void;
};

export type PartialDocument = {
  head: PartialElement;
  createElement(tagName: 'style'): PartialElement;
  reset?(): void;
};

class VirtualElement implements PartialElement<VirtualElement> {
  _hash = '';
  textContent = '';
  parentElement: VirtualElement | null = null;
  children: VirtualElement[] = [];
  setAttribute(qualifiedName: 'data-tss', value: string): void {
    switch (qualifiedName) {
      case 'data-tss':
        this._hash = value;
        break;
    }
  }
  insertAdjacentElement(where: 'beforebegin' | 'beforeend' | 'afterend', element: VirtualElement): void {
    switch (where) {
      case 'beforebegin':
        this.parentElement?.children.splice(this.parentElement.children.indexOf(this), 0, element);
        element.parentElement = this.parentElement;
        break;
      case 'beforeend':
        this.children.push(element);
        element.parentElement = this;
        break;
      case 'afterend':
        this.parentElement?.children.splice(this.parentElement.children.indexOf(this) + 1, 0, element);
        element.parentElement = this.parentElement;
        break;
    }
  }
  removeChild(child: any): void {
    const index = this.children.indexOf(child);

    if (index >= 0) {
      this.children.splice(index, 1);
    }
  }
}

class VirtualDocument implements PartialDocument {
  head = new VirtualElement();
  createElement(): VirtualElement {
    return new VirtualElement();
  }
  reset(): void {
    this.head.children.length = 0;
  }
}

const virtualDocument = new VirtualDocument();
const currentDocument: PartialDocument = typeof document === 'undefined' || isTest() ? virtualDocument : document;

export function getDocument(): PartialDocument {
  return currentDocument;
}

/**
 * Get a string containing all the `<style>` elements which have been
 * generated during SSR or testing.
 *
 * ```tsx
 * const appHtml = renderToString(<App />);
 * const stylesHtml = renderStylesToString();
 * ```
 *
 * **Note**: This will reset and clear all previously mounted styles.
 */
export function renderStylesToString(): string {
  if (virtualDocument.head.children.length === 0) {
    return '';
  }

  const cssString = virtualDocument.head.children
    .reduce(
      (acc, style) =>
        acc +
        '<style' +
        (style._hash ? ' data-tss="' + style._hash + '"' : '') +
        '>\n' +
        style.textContent +
        '\n</style>\n',
      '',
    )
    .trim();

  virtualDocument.reset();
  resetStyledStates();

  return cssString;
}
