import { useMemo } from 'react';
import { useStyleConfig } from './useStyleConfig';
import { Tokens } from '../types/Tokens';
import { getCssText } from '../utils/getCssText';

export function useCssText(styleTokens: Tokens, className: string | undefined): string {
  const { formatter } = useStyleConfig();

  return useMemo(() => getCssText(styleTokens, formatter, className), [styleTokens, formatter]);
}
