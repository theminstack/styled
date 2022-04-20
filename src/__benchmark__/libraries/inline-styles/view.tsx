import { type ReactElement, type ReactNode } from 'react';
import { type CSSProperties } from 'styled-components';

type ViewProps = {
  readonly children?: ReactNode;
  readonly style?: CSSProperties;
};

const View = (props: ViewProps): ReactElement => {
  return (
    <div
      style={{
        alignItems: 'stretch',
        borderStyle: 'solid',
        borderWidth: 0,
        boxSizing: 'border-box',
        display: 'flex',
        flexBasis: 'auto',
        flexDirection: 'column',
        flexShrink: 0,
        margin: 0,
        minHeight: 0,
        minWidth: 0,
        padding: 0,
        position: 'relative',
        ...(props.style ?? {}),
      }}
    >
      {props.children}
    </div>
  );
};

export { View };
