import { type ReactElement } from 'react';

import { type BoxProps } from './box-props';
import { type DotProps } from './dot-props';

type BenchmarkType = 'mount' | 'unmount' | 'update';

type BenchmarkRender = (components: BenchmarkComponents, index: number) => ReactElement;

type BenchmarkComponents = {
  readonly Box: React.ElementType<BoxProps>;
  readonly Dot: React.ElementType<DotProps>;
};

type BenchmarkConfig = {
  readonly name: string;
  readonly render: BenchmarkRender;
  readonly sampleCount?: number;
  readonly timeout?: number;
  readonly type: 'mount' | 'unmount' | 'update';
};

export type { BenchmarkComponents, BenchmarkConfig, BenchmarkRender, BenchmarkType };
