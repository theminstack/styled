import React, { ReactElement, ReactNode, useCallback } from 'react';

export interface IButtonProps {
  disabled?: boolean;
  children?: ReactNode;
  onClick?: () => void;
}

export default function Button({ disabled = false, children, onClick }: IButtonProps): ReactElement {
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
