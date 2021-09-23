import React, { ReactElement, ReactNode } from 'react';

interface IActionProps {
  onClick?: () => void;
  title?: string;
  children: ReactNode;
}

function Action({ onClick, title, children }: IActionProps): ReactElement {
  return (
    <div className={'action'} onClick={onClick} title={title}>
      {children}
    </div>
  );
}

export interface IActionItem {
  content: ReactElement;
  tip?: string;
  onClick?: () => void;
}

export interface IActionsProps {
  items?: IActionItem[];
}

export function Actions({ items = [] }: IActionsProps): ReactElement {
  return (
    <div className={'actions'}>
      {items.map((action, i) => (
        <Action key={i} onClick={action.onClick} title={action.tip}>
          {action.content}
        </Action>
      ))}
    </div>
  );
}
