import { type ReactElement, type ReactNode, Children } from 'react';

import { ScrollIntoView } from './scroll-into-view';

export interface ListProps {
  children?: ReactNode;
}

export function List({ children }: ListProps): ReactElement {
  return (
    <div className={'list'}>
      {children}
      <ScrollIntoView key={Children.count(children)} />
    </div>
  );
}
