import { IBoxProps } from '../../types/IBoxProps';
import { View } from './View';
import { styled } from './styled';

export const Box = styled(View)<IBoxProps>`
  align-self: flex-start;
  flex-direction: ${(props) => (props.$layout === 'column' ? 'column' : 'row')};
  padding: ${({ $outer = false }) => ($outer ? '4px' : '0')};
  height: ${({ $fixed = false }) => ($fixed ? '6px' : null)};
  width: ${({ $fixed = false }) => ($fixed ? '6px' : null)};
  background-color: ${(props) => props.$color};
`;
