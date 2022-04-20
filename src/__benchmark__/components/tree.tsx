import { type ElementType, type ReactElement } from 'react';

import { type BoxProps } from '../types/box-props';

const colors = ['#14171A', '#AAB8C2', '#E6ECF0', '#FFAD1F', '#F45D22', '#E0245E'];

const array = function <T>(length: number, factory: (index: number) => T): T[] {
  const value = Array.from<T>({ length });

  for (let index = length - 1; index >= 0; index--) {
    value[index] = factory(index);
  }

  return value;
};

type TreeProps = {
  readonly Box: ElementType<BoxProps>;
  readonly breadth: number;
  readonly colorIndex?: number;
  readonly depth: number;
  readonly wrap: number;
};

const Tree = ({ breadth, depth, wrap, colorIndex = 0, Box }: TreeProps): ReactElement => {
  let result = (
    <Box $color={colors[colorIndex % 3]} $layout={depth % 2 === 0 ? 'column' : 'row'} $outer>
      {depth === 0 && <Box $color={colors[(colorIndex % 3) + 3]} $fixed />}
      {depth !== 0 &&
        array(breadth, (index) => (
          <Tree breadth={breadth} Box={Box} depth={depth - 1} colorIndex={index} key={index} wrap={wrap} />
        ))}
    </Box>
  );

  for (let index = 0; index < wrap; index++) {
    result = <Box $color={colors[0]}>{result}</Box>;
  }

  return result;
};

export { Tree };
