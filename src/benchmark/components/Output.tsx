import React, { ReactElement, ReactNode } from 'react';

export interface IOutputProps {
  children?: ReactNode;
}

export function Output({ children }: IOutputProps): ReactElement {
  return (
    <div className={'output'}>
      <div className={'output__content'}>{children}</div>
    </div>
  );
}
