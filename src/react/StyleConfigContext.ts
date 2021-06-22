import { createContext } from 'react';
import { defaultStyleFormatter } from '../DefaultStyleFormatter';
import { defaultStyleManager } from '../DefaultStyleManager';
import { IStyleConfig } from '../types/IStyleConfig';

export const StyleConfigContext = createContext<IStyleConfig>({
  serverManager: null,
  clientManager: defaultStyleManager,
  formatter: defaultStyleFormatter,
});
