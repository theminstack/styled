import { type ReactElement, type ReactNode, Children } from 'react';

import { ScrollIntoView } from './scroll-into-view';

interface ListProps {
  children?: ReactNode;
}

function List({ children }: ListProps): ReactElement {
  return (
    <div className={'list'}>
      {children}
      <ScrollIntoView key={Children.count(children)} />
    </div>
  );
}

export { List };
