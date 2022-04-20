import { type ReactElement, type ReactNode } from 'react';

type FormProps = {
  readonly children?: ReactNode;
};

const Form = ({ children }: FormProps): ReactElement => {
  return <div className={'form'}>{children}</div>;
};

export { Form };
