import React, { ComponentProps, ReactElement } from 'react';
import { IDotProps } from '../../types/IDotProps';
import { View } from './View';
import { styled } from './styled';

const StyledDot = styled(View)<IDotProps>`
  position: absolute;
  cursor: pointer;
  width: 0;
  height: 0;
  border-color: transparent;
  border-style: solid;
  border-top-width: 0;
  transform: translate(50%, 50%);
  margin-left: ${(props) => `${props.$x}px`};
  margin-top: ${(props) => `${props.$y}px`};
  border-right-width: ${(props) => `${props.$size / 2}px`};
  border-bottom-width: ${(props) => `${props.$size / 2}px`};
  border-left-width: ${(props) => `${props.$size / 2}px`};
`;

export const Dot = (props: ComponentProps<typeof StyledDot>): ReactElement => {
  return <StyledDot {...props} style={{ borderBottomColor: props.$color }} />;
};
