import { type ReactElement, type ReactNode } from 'react';

type OutputProps = {
  readonly children?: ReactNode;
};

const Output = ({ children }: OutputProps): ReactElement => {
  return (
    <div className={'output'}>
      <div className={'output__content'}>{children}</div>
    </div>
  );
};

export { Output };
