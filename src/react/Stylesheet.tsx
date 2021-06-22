import { ReactElement } from 'react';
import { useStyle } from './useStyle';

export interface IStyleProps {
  className: string;
  cssText: string;
}

export function Stylesheet({ className, cssText }: IStyleProps): ReactElement | null {
  return useStyle(className, cssText);
}
Stylesheet.displayName = '$$Stylesheet';
