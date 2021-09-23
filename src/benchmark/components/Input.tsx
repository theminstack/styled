import React, { ReactElement, ReactNode } from 'react';

export interface IInputProps {
  children?: ReactNode;
}

export function Input({ children }: IInputProps): ReactElement {
  return <div className={'input'}>{children}</div>;
}
