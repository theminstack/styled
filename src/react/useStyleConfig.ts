import { useContext } from 'react';
import { IStyleConfig } from '../types/IStyleConfig';
import { StyleConfigContext } from './StyleConfigContext';

/**
 * TSS configuration hook.
 */
export function useStyleConfig(): IStyleConfig {
  return useContext(StyleConfigContext);
}
