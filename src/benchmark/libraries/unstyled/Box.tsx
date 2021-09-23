import React, { FC } from 'react';
import { IBoxProps } from '../../types/IBoxProps';

export const Box: FC<IBoxProps> = (props) => <div>{props.children}</div>;
