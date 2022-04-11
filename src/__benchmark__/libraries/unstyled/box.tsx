import { type FC } from 'react';

import { type BoxProps } from '../../types/box-props';

export const Box: FC<BoxProps> = (props) => <div>{props.children}</div>;
