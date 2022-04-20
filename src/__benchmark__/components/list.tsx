import { type ReactElement, type ReactNode, Children } from 'react';

import { ScrollIntoView } from './scroll-into-view';

type ListProps = {
  readonly children?: ReactNode;
};

const List = ({ children }: ListProps): ReactElement => {
  return (
    <div className={'list'}>
      {children}
      <ScrollIntoView key={Children.count(children)} />
    </div>
  );
};

export { List };
