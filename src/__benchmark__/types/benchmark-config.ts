import { type ReactElement } from 'react';

import { type BoxProps } from './box-props';
import { type DotProps } from './dot-props';

type BenchmarkType = 'mount' | 'unmount' | 'update';

type BenchmarkRender = (components: BenchmarkComponents, i: number) => ReactElement;

interface BenchmarkComponents {
  Dot: React.ElementType<DotProps>;
  Box: React.ElementType<BoxProps>;
}

interface BenchmarkConfig {
  name: string;
  type: 'mount' | 'unmount' | 'update';
  render: BenchmarkRender;
  timeout?: number;
  sampleCount?: number;
}

export type { BenchmarkComponents, BenchmarkConfig, BenchmarkRender, BenchmarkType };
