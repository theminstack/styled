import { type ReactElement, type ReactNode } from 'react';

interface InputProps {
  children?: ReactNode;
}

function Input({ children }: InputProps): ReactElement {
  return <div className={'input'}>{children}</div>;
}

export { Input };
