import { type LibraryConfig } from '../types/library-config';
import * as inlineStyles from './inline-styles';
import * as reactMicroStyled from './react-micro-styled';
import * as styledComponents from './styled-components';
import * as unstyled from './unstyled';

export const libraries: readonly LibraryConfig[] = [reactMicroStyled, styledComponents, inlineStyles, unstyled];
