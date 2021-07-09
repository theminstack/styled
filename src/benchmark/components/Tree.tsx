import React, { ElementType, ReactElement } from 'react';
import { IBoxProps } from '../types/IBoxProps';

export interface ITreeProps {
  breadth: number;
  depth: number;
  wrap: number;
  colorIndex?: number;
  Box: ElementType<IBoxProps>;
}

const colors = ['#14171A', '#AAB8C2', '#E6ECF0', '#FFAD1F', '#F45D22', '#E0245E'];

function array<T>(length: number, factory: (i: number) => T): T[] {
  const value = new Array(length);

  for (let i = length - 1; i >= 0; i--) {
    value[i] = factory(i);
  }

  return value;
}

export default function Tree({ breadth, depth, wrap, colorIndex = 0, Box }: ITreeProps): ReactElement {
  let result = (
    <Box $color={colors[colorIndex % 3]} $layout={depth % 2 === 0 ? 'column' : 'row'} $outer>
      {depth === 0 && <Box $color={colors[(colorIndex % 3) + 3]} $fixed />}
      {depth !== 0 &&
        array(breadth, (i) => (
          <Tree breadth={breadth} Box={Box} depth={depth - 1} colorIndex={i} key={i} wrap={wrap} />
        ))}
    </Box>
  );

  for (let i = 0; i < wrap; i++) {
    result = <Box $color={colors[0]}>{result}</Box>;
  }

  return result;
}
