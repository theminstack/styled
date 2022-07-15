import { type ReactNode } from 'react';

type DotProps = {
  readonly $color: string;
  readonly $size: number;
  readonly $x: number;
  readonly $y: number;
  readonly children?: ReactNode;
};

export type { DotProps };
