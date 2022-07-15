import { type ReactNode } from 'react';

type BoxProps = {
  readonly $color: string;
  readonly $fixed?: boolean;
  readonly $layout?: 'column' | 'row';
  readonly $outer?: boolean;
  readonly children?: ReactNode;
};

export type { BoxProps };
