/* eslint-disable */
import React, { createRef } from 'react';
import { css } from 'styled-components';
import { createTheme, createStyled } from '.';

// This file is not part of the library. It's a sandbox for
// experimentation during development.

// Theme

const [useTheme, ThemeProvider] = createTheme({
  foreground: 'black',
  background: 'white',
});
<ThemeProvider
  value={{
    foreground: 'blue',
  }}
/>;
<ThemeProvider
  value={(theme) => ({
    foreground: theme.background,
    background: theme.foreground,
  })}
/>;

// Setup

const styled = createStyled(useTheme);

// Styled Component

function Component(props: {
  ref?: React.LegacyRef<{ foo(): void }>;
  className?: string;
  $value1?: string | number;
  $value2?: string | number;
}): null {
  return null;
}
const StyledComponent = styled(Component)<{ $value2?: string | number; $other1?: number }>`
  color: ${(props) => props.theme.foreground};
  color: ${(props) => props.className};
  color: ${(props) => props.$value1};
`;
const refComponent = createRef<{ foo(): void }>();
<StyledComponent ref={refComponent} />;

const ReStyledComponent = styled(StyledComponent)<{ $other2?: string }>`
  color: ${(props) => props.theme.foreground};
  color: ${(props) => props.className};
  color: ${(props) => props.$value1};
  ${StyledComponent.selector} {
    color: red;
  }
`;
<ReStyledComponent ref={refComponent} />;

const Div = styled('div')<{ foo: string }>`
  color: ${(props) => props.theme.foreground};
  color: blue;
`;

// Styled Element

const StyledDiv = styled('div')<{ $other1?: string }>`
  color: ${(props) => props.theme.foreground};
  color: ${(props) => props.className};
  color: ${(props) => props.$other1};
`;
const refDiv = createRef<HTMLDivElement>();
<StyledDiv ref={refDiv} />;

// Global Style

const GlobalStyle2 = styled.global<{ $other1?: string }>`
  color: ${(props) => props.theme.foreground};
  color: ${(props) => props.$other1};
`;
<GlobalStyle2 />;

const GlobalStyle3 = styled.global`
  color: ${(props) => props.theme.foreground};
  color: red;
`;
<GlobalStyle3 />;

// Styled Helper

const helper1 = css<{ foo: string }>`
  color: ${(props) => props.foo};
`;

const helper2 = css<{ foo?: string }>`
  color: ${(props) => props.foo};
`;

const helper3 = css`
  color: blue;
`;
