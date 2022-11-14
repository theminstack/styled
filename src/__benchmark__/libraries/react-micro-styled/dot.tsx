import { type ComponentProps, type ReactElement } from 'react';

import { type DotProps } from '../../types/dot-props';
import { styled } from './styled';
import { View } from './view';

const StyledDot = styled(View)<DotProps>`
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
