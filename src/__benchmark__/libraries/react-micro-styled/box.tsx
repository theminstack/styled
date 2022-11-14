import { type BoxProps } from '../../types/box-props';
import { styled } from './styled';
import { View } from './view';

export const Box = styled(View)<BoxProps>`
  align-self: flex-start;
  flex-direction: ${(props) => (props.$layout === 'column' ? 'column' : 'row')};
  padding: ${({ $outer = false }) => ($outer ? '4px' : '0')};
  height: ${({ $fixed = false }) => ($fixed ? '6px' : null)};
  width: ${({ $fixed = false }) => ($fixed ? '6px' : null)};
  background-color: ${(props) => props.$color};
`;
