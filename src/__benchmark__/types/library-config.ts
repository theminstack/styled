import { type ElementType } from 'react';

import { type BoxProps } from './box-props';
import { type DotProps } from './dot-props';

type LibraryConfig = {
  readonly Box: ElementType<BoxProps>;
  readonly Dot: ElementType<DotProps>;
  readonly name: string;
};

export type { LibraryConfig };
