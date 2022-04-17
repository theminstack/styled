import { type ReactElement, type ReactNode } from 'react';

interface OutputProps {
  children?: ReactNode;
}

function Output({ children }: OutputProps): ReactElement {
  return (
    <div className={'output'}>
      <div className={'output__content'}>{children}</div>
    </div>
  );
}

export { Output };
