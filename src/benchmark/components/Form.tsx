import React, { ReactElement, ReactNode } from 'react';

export interface IFormProps {
  children?: ReactNode;
}

export default function Form({ children }: IFormProps): ReactElement {
  return <div className={'form'}>{children}</div>;
}
