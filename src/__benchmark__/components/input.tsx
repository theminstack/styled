import { type ReactElement, type ReactNode } from 'react';

type InputProps = {
  readonly children?: ReactNode;
};

const Input = ({ children }: InputProps): ReactElement => {
  return <div className={'input'}>{children}</div>;
};

export { Input };
