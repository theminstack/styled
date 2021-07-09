import View from './View';
import { IBoxProps } from '../../types/IBoxProps';
import { styled } from '../../../styled';

export const Box = styled(View).props<IBoxProps>()`
  align-self: flex-start;
  flex-direction: ${(props) => (props.$layout === 'column' ? 'column' : 'row')};
  padding: ${(props) => (props.$outer ? '4px' : '0')};
  height: ${(props) => (props.$fixed ? '6px' : null)};
  width: ${(props) => (props.$fixed ? '6px' : null)};
  background-color: ${(props) => props.$color};
`;
