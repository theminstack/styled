import { type ReactElement, type ReactNode } from 'react';

interface PageProps {
  children?: ReactNode;
}

function Page({ children }: PageProps): ReactElement {
  return <div className={'page'}>{children}</div>;
}

export { Page };
