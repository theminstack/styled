import { type ReactElement, type ReactNode, useCallback } from 'react';

interface ButtonProps {
  disabled?: boolean;
  children?: ReactNode;
  onClick?: () => void;
}

function Button({ disabled = false, children, onClick }: ButtonProps): ReactElement {
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

export { Button };
