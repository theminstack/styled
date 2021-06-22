import { IStyleFormatter } from '../types/IStyleFormatter';
import { Tokens } from '../types/Tokens';

interface IBlock {
  prefix: string;
  suffix: string;
  indent: string;
  conditions: string[];
  deferred: IBlock[];
  isParent: boolean;
  isWritten: boolean;
  isVirtual: boolean;
}

const singleIndent = '  ';
const reAtRuleBlockNames =
  /^(?:(media|supports|document)|page|font-face|keyframes|viewport|counter-style|font-feature-values|property|color-profile)/;
const blockTemplate: IBlock = {
  prefix: '',
  suffix: '',
  indent: '',
  conditions: [],
  deferred: [],
  isParent: false,
  isVirtual: false,
  isWritten: false,
};

/**
 * Get a formatted CSS text string.
 */
export function getCssText(styleTokens: Tokens, formatter: IStyleFormatter, className: string | undefined): string {
  const rootSelectors = [className ? '.' + className : ':root'];
  const blocks: IBlock[] = [
    {
      ...blockTemplate,
      prefix: formatter.openBlock('', rootSelectors),
      suffix: formatter.closeBlock(''),
      conditions: rootSelectors,
    },
  ];

  let indexStart = 0;
  let indexEnd = 0;
  let indexColon: number | null = null;
  let atImports = '';
  let atNamespaces = '';
  let atOtherProps = '';
  let result = '';

  function openBlock() {
    if (styleTokens[indexStart] === '@' && indexEnd - indexStart > 2) {
      const [isKnown, isConditionalGroup] = styleTokens[indexStart + 1]?.match(reAtRuleBlockNames) ?? [];
      const at = getTokenValues(indexStart, indexEnd);

      if (isKnown) {
        const conditions = blocks[0].conditions;

        blocks.unshift({
          ...blockTemplate,
          prefix: formatter.openBlock('', at),
          suffix: formatter.closeBlock(''),
          deferred: blocks.splice(0),
          isParent: true,
        });

        isConditionalGroup &&
          blocks.unshift({
            ...blockTemplate,
            prefix: formatter.openBlock(singleIndent, conditions),
            suffix: formatter.closeBlock(singleIndent),
            indent: singleIndent,
            conditions: conditions,
            isVirtual: true,
          });
      } else {
        const indent = blocks[0].indent + singleIndent;

        blocks.unshift({
          ...blockTemplate,
          prefix: formatter.openBlock(indent, at),
          suffix: formatter.closeBlock(indent),
          indent: indent,
          deferred: blocks.splice(0),
          isParent: true,
        });
      }
    } else {
      let parentIndex = 0;

      for (; parentIndex < blocks.length && !blocks[parentIndex].isParent; parentIndex++);

      const indent = blocks[parentIndex] != null ? blocks[parentIndex].indent + singleIndent : '';
      const parentSelectors = blocks[0].conditions;
      const selectors = getTokenValues(indexStart, indexEnd).reduce<string[]>(
        (acc, child) => [
          ...acc,
          ...(parentSelectors.length
            ? parentSelectors.map((parent) =>
                /&/.test(child) ? child.replace(/&/g, parent) : parent === ':root' ? child : parent + ' ' + child,
              )
            : [child]),
        ],
        [],
      );

      blocks.unshift({
        ...blockTemplate,
        prefix: formatter.openBlock(indent, selectors),
        suffix: formatter.closeBlock(indent),
        indent: indent,
        conditions: selectors,
        deferred: blocks.splice(0, parentIndex),
      });
    }
  }

  function closeBlock() {
    if (blocks.length) {
      const closed: IBlock[] = [];
      let block: IBlock;

      do {
        block = blocks.shift() as IBlock;
        closed.push(block);
        blocks.unshift(...block.deferred);
      } while (block.isVirtual && blocks.length);

      closeBlockWrite(closed);
    }
  }

  function property() {
    const isAt = styleTokens[indexStart] === '@';

    if (isAt) {
      const name = indexEnd - indexStart >= 2 && styleTokens[indexStart + 1];
      const rule = formatter.property('', null, getTokenValues(indexStart, indexEnd));

      switch (name) {
        case 'import':
          atImports += rule;
          break;
        case 'namespace':
          atNamespaces += rule;
          break;
        case 'charset':
          break;
        default:
          atOtherProps += rule;
      }
    } else {
      indexColon = indexColon ?? indexEnd;

      const keys = getTokenValues(indexStart, indexColon);
      const values = getTokenValues(indexColon + 1, indexEnd);

      if (!values.length) {
        return;
      }

      openBlockWrite(blocks);

      keys.forEach((key: string | null) => {
        result += formatter.property(blocks[0].indent + singleIndent, key, values);
      });
    }
  }

  function openBlockWrite(blocks: IBlock[], i = 0) {
    if (blocks[i] && !blocks[i].isWritten) {
      closeBlockWrite(blocks[i].deferred);
      openBlockWrite(blocks, i + 1);
      result += blocks[i].prefix;
      blocks[i].isWritten = true;
    }
  }

  function closeBlockWrite(blocks: IBlock[], i = blocks.length - 1) {
    if (blocks[i] && blocks[i].isWritten) {
      closeBlockWrite(blocks, i - 1);
      result += blocks[i].suffix;
      blocks[i].isWritten = false;
    }
  }

  function getTokenValues(start: number, end: number) {
    const values: string[] = [];

    let value = '';

    for (let i = start; i < end; ++i) {
      if (styleTokens[i] !== ',') {
        value += styleTokens[i];
      } else {
        value && values.push(value);
        value = '';
      }
    }

    value && values.push(value);

    return values;
  }

  for (indexStart = 0, indexEnd = 0; indexEnd < styleTokens.length; ++indexEnd) {
    switch (styleTokens[indexEnd]) {
      case ':':
        indexColon = indexColon ?? indexEnd;
        continue;
      case ';': {
        property();
        break;
      }
      case '{': {
        openBlock();
        break;
      }
      case '}': {
        closeBlock();
        break;
      }
      default:
        continue;
    }

    indexStart = indexEnd + 1;
    indexColon = null;
  }

  closeBlock();

  return [atImports, atNamespaces, atOtherProps, result].filter((value) => !!value).join('\n');
}
