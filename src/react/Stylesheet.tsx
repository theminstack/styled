import { ReactElement } from 'react';
import { useStyle } from './useStyle';

export interface IStylesheetProps {
  className: string;
  cssText: string;
}

export function Stylesheet(props: IStylesheetProps): ReactElement | null {
  const { className, cssText } = props;
  return useStyle({ key: className, cssText });
}
Stylesheet.displayName = '$$Stylesheet';
