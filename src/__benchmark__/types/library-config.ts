import { type ElementType } from 'react';

import { type BoxProps } from './box-props';
import { type DotProps } from './dot-props';

export interface LibraryConfig {
  name: string;
  Dot: ElementType<DotProps>;
  Box: ElementType<BoxProps>;
}
