import { type ReactElement, type ReactNode } from 'react';

interface ActionProps {
  onClick?: () => void;
  title?: string;
  children: ReactNode;
}

function Action({ onClick, title, children }: ActionProps): ReactElement {
  return (
    <div className={'action'} onClick={onClick} title={title}>
      {children}
    </div>
  );
}

export interface ActionItem {
  content: ReactElement;
  tip?: string;
  onClick?: () => void;
}

export interface ActionsProps {
  items?: ActionItem[];
}

export function Actions({ items = [] }: ActionsProps): ReactElement {
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
