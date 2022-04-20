import { type ReactElement, type ReactNode } from 'react';

type PageProps = {
  readonly children?: ReactNode;
};

const Page = ({ children }: PageProps): ReactElement => {
  return <div className={'page'}>{children}</div>;
};

export { Page };
