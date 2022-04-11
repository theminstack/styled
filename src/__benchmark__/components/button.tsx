import { type ReactElement, type ReactNode, useCallback } from 'react';

export interface ButtonProps {
  disabled?: boolean;
  children?: ReactNode;
  onClick?: () => void;
}

export function Button({ disabled = false, children, onClick }: ButtonProps): ReactElement {
  const $onClick = useCallback(() => {
    if (!disabled) {
      onClick?.();
    }
  }, [disabled, onClick]);

  return (
    <button className={'button' + (disabled ? ' button--disabled' : '')} onClick={$onClick}>
      {children}
    </button>
  );
}
