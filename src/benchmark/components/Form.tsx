import React, { ReactElement, ReactNode } from 'react';

export interface IFormProps {
  children?: ReactNode;
}

export function Form({ children }: IFormProps): ReactElement {
  return <div className={'form'}>{children}</div>;
}
