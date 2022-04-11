import { type ReactElement, type ReactNode } from 'react';

export interface InputProps {
  children?: ReactNode;
}

export function Input({ children }: InputProps): ReactElement {
  return <div className={'input'}>{children}</div>;
}
