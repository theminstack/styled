import { type ReactElement, type ReactNode } from 'react';

type ActionProps = {
  readonly children: ReactNode;
  readonly onClick?: () => void;
  readonly title?: string;
};

const Action = ({ onClick, title, children }: ActionProps): ReactElement => {
  return (
    <div className={'action'} onClick={onClick} title={title}>
      {children}
    </div>
  );
};

type ActionItem = {
  readonly content: ReactElement;
  readonly onClick?: () => void;
  readonly tip?: string;
};

type ActionsProps = {
  readonly items?: readonly ActionItem[];
};

const Actions = ({ items = [] }: ActionsProps): ReactElement => {
  return (
    <div className={'actions'}>
      {items.map((action, index) => (
        <Action key={index} onClick={action.onClick} title={action.tip}>
          {action.content}
        </Action>
      ))}
    </div>
  );
};

export { Actions };
