import { type AstNode } from './compile.js';

type Builder = {
  readonly close: () => void;
  readonly open: (selectorsOrAtRule: string) => void;
  readonly prop: (keyAndValue: string) => void;
  readonly toString: () => string;
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

  if (at) builder.open(at);

  for (const child of node.children) {
    if (typeof child === 'string') {
      if (!isOpen && isConditionalGroup) {
        isOpen = true;
        builder.open(selectors.join(', ') || ':root');
      }
      builder.prop(child);
    } else {
      if (isOpen) {
        isOpen = false;
        builder.close();
      }
      formatNode(child, selectors, builder);
    }
  }

  if (isOpen) builder.close();
  if (at) builder.close();
};

const createBuilder = () => {
  const indentString = '  ';

  let css = '';
  let indent = '';

  return {
    close: (): void => {
      indent = indent.slice(indentString.length);
      css += indent + '}\n';
    },
    open: (selectorsOrAtRule: string): void => {
      css += indent + selectorsOrAtRule + ' {\n';
      indent += indentString;
    },
    prop: (keyAndValue: string): void => {
      css += indent + keyAndValue + ';\n';
    },
    toString: (): string => css.trim(),
  };
};

const format = (ast: AstNode, scope?: string): string => {
  const builder = createBuilder();
  formatNode(ast, scope ? [scope] : [], builder);
  return builder.toString();
};

export { format };
