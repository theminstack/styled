import React, { ReactElement, ReactNode } from 'react';

export interface IPageProps {
  children?: ReactNode;
}

export function Page({ children }: IPageProps): ReactElement {
  return <div className={'page'}>{children}</div>;
}