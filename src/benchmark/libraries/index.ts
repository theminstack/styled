/* eslint-disable import/no-namespace */
import { LibraryConfig } from '../types/schemaLibraryConfig';
import * as inlineStyles from './inline-styles';
import * as styledComponents from './styled-components';
import * as tsstyled from './tsstyled';
import * as unstyled from './unstyled';

export const libraries: LibraryConfig[] = [tsstyled, styledComponents, inlineStyles, unstyled];
