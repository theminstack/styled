import { environment, isBrowser } from '../util/environment.js';
import { type AstNode } from './compile.js';
import { type Printer, createMinifiedPrinter, createPrettyPrinter } from './printer.js';

const mergeSelectors = (parentSelectors: string[], selectors: [string, ...string[]]): string[] => {
  return parentSelectors.length
    ? parentSelectors.flatMap((parentSelector) =>
        selectors.map((selector) =>
          selector.includes('\0') ? selector.replaceAll('\0&\0', parentSelector) : parentSelector + ' ' + selector,
        ),
      )
    : selectors.map((selector) => selector.replaceAll('\0&\0', ':root'));
};

const formatNode = (node: AstNode, parentSelectors: string[], printer: Printer): void => {
  const [isConditionalGroup, selectors, at] = node.condition
    ? 'selectors' in node.condition
      ? [true, mergeSelectors(parentSelectors, node.condition.selectors), undefined]
      : /^@(media|supports|document)\b/.test(node.condition.at)
      ? [true, parentSelectors, node.condition.at]
      : [false, [], node.condition.at]
    : [true, parentSelectors, undefined];

  let isOpen = false;

  if (at) printer.open(at);

  for (const child of node.children) {
    if (typeof child === 'string') {
      if (!isOpen && isConditionalGroup) {
        isOpen = true;
        printer.open(selectors.join(', ') || ':root');
      }
      printer.prop(child);
    } else {
      if (isOpen) {
        isOpen = false;
        printer.close();
      }
      formatNode(child, selectors, printer);
    }
  }

  if (isOpen) printer.close();
  if (at) printer.close();
};

const format = (ast: AstNode | undefined, scope?: string): string => {
  if (!ast) return '';
  const printer: Printer = !isBrowser || environment === 'production' ? createMinifiedPrinter() : createPrettyPrinter();
  formatNode(ast, scope ? [scope] : [], printer);
  return printer.toString().trim();
};

export { format };
