import { type ReactElement, type ReactNode } from 'react';

export interface PageProps {
  children?: ReactNode;
}

export function Page({ children }: PageProps): ReactElement {
  return <div className={'page'}>{children}</div>;
}
