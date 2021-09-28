import { PartialDocument, PartialElement } from './Document';

export function createStyleElement(doc: PartialDocument, cssString: string, hash: string): PartialElement {
  const el = doc.createElement('style');

  el.setAttribute('data-tss', hash);
  el.textContent = cssString;

  return el;
}
