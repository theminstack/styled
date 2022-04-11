import { type ReactElement, type ReactNode } from 'react';

export interface OutputProps {
  children?: ReactNode;
}

export function Output({ children }: OutputProps): ReactElement {
  return (
    <div className={'output'}>
      <div className={'output__content'}>{children}</div>
    </div>
  );
}
