import React, { Children, ReactElement, ReactNode } from 'react';
import { ScrollIntoView } from './ScrollIntoView';

export interface IListProps {
  children?: ReactNode;
}

export function List({ children }: IListProps): ReactElement {
  return (
    <div className={'list'}>
      {children}
      <ScrollIntoView key={Children.count(children)} />
    </div>
  );
}
