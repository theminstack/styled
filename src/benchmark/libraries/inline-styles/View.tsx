import React, { ReactElement, ReactNode } from 'react';
import { CSSProperties } from 'styled-components';

export default function View(props: { style?: CSSProperties; children?: ReactNode }): ReactElement {
  return (
    <div
      style={{
        alignItems: 'stretch',
        borderWidth: 0,
        borderStyle: 'solid',
        boxSizing: 'border-box',
        display: 'flex',
        flexBasis: 'auto',
        flexDirection: 'column',
        flexShrink: 0,
        margin: 0,
        padding: 0,
        position: 'relative',
        minHeight: 0,
        minWidth: 0,
        ...(props.style ?? {}),
      }}
    >
      {props.children}
    </div>
  );
}
