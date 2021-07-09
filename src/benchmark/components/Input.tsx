import React, { ReactElement, ReactNode } from 'react';

export interface IInputProps {
  children?: ReactNode;
}

export default function Input({ children }: IInputProps): ReactElement {
  return <div className={'input'}>{children}</div>;
}
