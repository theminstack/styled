import { type AstNode } from './compile.js';

type Builder = {
  readonly build: () => string;
  readonly declaration: (declaration: string) => void;
  readonly ruleClose: () => void;
  readonly ruleOpen: (selector: string) => void;
};

const mergeSelectors = (parentSelectors: readonly string[], selectors: readonly [string, ...string[]]): string[] => {
  return parentSelectors.length
    ? parentSelectors.flatMap((parentSelector) =>
        selectors.map((selector) =>
          selector.includes('\0') ? selector.replaceAll('\0&\0', parentSelector) : parentSelector + ' ' + selector,
        ),
      )
    : selectors.map((selector) => selector.replaceAll('\0&\0', ':root'));
};

const formatNode = (node: AstNode, parentSelectors: string[], builder: Builder): void => {
  const [isConditionalGroup, selectors, at] = node.condition
    ? 'selectors' in node.condition
      ? [true, mergeSelectors(parentSelectors, node.condition.selectors), undefined]
      : /^@(media|supports|document)\b/.test(node.condition.at)
      ? [true, parentSelectors, node.condition.at]
      : [false, [], node.condition.at]
    : [true, parentSelectors, undefined];

  let isOpen = false;

  if (at) builder.ruleOpen(at);

  for (const child of node.children) {
    if (typeof child === 'string') {
      if (!isOpen && isConditionalGroup) {
        isOpen = true;
        builder.ruleOpen(selectors.join(', ') || ':root');
      }
      builder.declaration(child);
    } else {
      if (isOpen) {
        isOpen = false;
        builder.ruleClose();
      }
      formatNode(child, selectors, builder);
    }
  }

  if (isOpen) builder.ruleClose();
  if (at) builder.ruleClose();
};

const createBuilder = () => {
  const indentString = '  ';

  let css = '';
  let indent = '';

  return {
    build: (): string => css.trim(),
    declaration: (declaration: string): void => {
      css += indent + declaration + ';\n';
    },
    ruleClose: (): void => {
      indent = indent.slice(indentString.length);
      css += indent + '}\n';
    },
    ruleOpen: (selector: string): void => {
      css += indent + selector + ' {\n';
      indent += indentString;
    },
  };
};

const format = (ast: AstNode, scope?: string): string => {
  const builder = createBuilder();
  formatNode(ast, scope ? [scope] : [], builder);
  return builder.build();
};

export { format };
