import { type ReactElement, type ReactNode, useCallback } from 'react';

type ButtonProps = {
  readonly children?: ReactNode;
  readonly disabled?: boolean;
  readonly onClick?: () => void;
};

const Button = ({ disabled = false, children, onClick }: ButtonProps): ReactElement => {
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
};

export { Button };
