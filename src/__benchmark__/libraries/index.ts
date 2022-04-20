import { type LibraryConfig } from '../types/library-config';
import * as inlineStyles from './inline-styles';
import * as styledComponents from './styled-components';
import * as tsstyled from './tsstyled';
import * as unstyled from './unstyled';

export const libraries: readonly LibraryConfig[] = [tsstyled, styledComponents, inlineStyles, unstyled];
