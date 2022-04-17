import { type ReactElement, type ReactNode } from 'react';

interface FormProps {
  children?: ReactNode;
}

function Form({ children }: FormProps): ReactElement {
  return <div className={'form'}>{children}</div>;
}

export { Form };
