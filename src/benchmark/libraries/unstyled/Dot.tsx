import React, { FC } from 'react';
import { IDotProps } from '../../types/IDotProps';

export const Dot: FC<IDotProps> = (props) => <div>{props.children}</div>;
