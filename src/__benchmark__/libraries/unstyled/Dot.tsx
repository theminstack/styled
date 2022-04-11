import { type FC } from 'react';

import { type DotProps } from '../../types/dot-props';

export const Dot: FC<DotProps> = (props) => <div>{props.children}</div>;
