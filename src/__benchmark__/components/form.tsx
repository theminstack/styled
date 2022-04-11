import { type ReactElement, type ReactNode } from 'react';

export interface FormProps {
  children?: ReactNode;
}

export function Form({ children }: FormProps): ReactElement {
  return <div className={'form'}>{children}</div>;
}
