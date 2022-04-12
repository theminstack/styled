import { type ReactElement } from 'react';

import { type BoxProps } from './box-props';
import { type DotProps } from './dot-props';

export type BenchmarkType = 'mount' | 'unmount' | 'update';

export type BenchmarkRender = (components: BenchmarkComponents, i: number) => ReactElement;

export interface BenchmarkComponents {
  Dot: React.ElementType<DotProps>;
  Box: React.ElementType<BoxProps>;
}

export interface BenchmarkConfig {
  name: string;
  type: 'mount' | 'unmount' | 'update';
  render: BenchmarkRender;
  timeout?: number;
  sampleCount?: number;
}
