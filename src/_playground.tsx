/* eslint-disable */
import { type LegacyRef, createRef } from 'react';
import { createReactTheme, createStyled } from '.';

// This file is not part of the library. It's a sandbox for
// experimentation during development.

// Theme

const [useTheme, ThemeProvider] = createReactTheme({
  foreground: 'black',
  background: 'white',
});
<ThemeProvider
  value={{
    foreground: 'blue',
    background: 'lightyellow',
  }}
/>;

// Setup

const styled = createStyled(useTheme);

// Styled Component

function Component(props: {
  ref?: LegacyRef<{ foo(): void }>;
  className?: string;
  $value1?: string | number;
  $value2?: string | number;
}): null {
  return null;
}
const StyledComponent = styled(Component)<{ $value2?: string | number; $other1?: number }>`
  color: ${(_props, theme) => theme.foreground};
  color: ${(props) => props.className};
  color: ${(props) => props.$value1};
`;
const refComponent = createRef<{ foo(): void }>();
<StyledComponent ref={refComponent} />;

const ReStyledComponent = styled(StyledComponent)<{ $other2?: string }>`
  color: ${(_props, theme) => theme.foreground};
  color: ${(props) => props.className};
  color: ${(props) => props.$value1};
  ${StyledComponent} {
    color: red;
  }
`;
<ReStyledComponent ref={refComponent} />;

const Div = styled('div')<{ foo: string }>`
  color: ${(_props, theme) => theme.foreground};
  color: blue;
`;

// Styled Element

const StyledDiv = styled('div')<{ $other1?: string }>`
  color: ${(_props, theme) => theme.foreground};
  color: ${(props) => props.className};
  color: ${(props) => props.$other1};
`;
const refDiv = createRef<HTMLDivElement>();
<StyledDiv ref={refDiv} />;

// Global Style

const GlobalStyle2 = styled.global<{ $other1?: string }>`
  color: ${(_props, theme) => theme.foreground};
  color: ${(props) => props.$other1};
`;
<GlobalStyle2 />;

const GlobalStyle3 = styled.global`
  color: ${(_props, theme) => theme.foreground};
  color: red;
`;
<GlobalStyle3 />;

// Styled Helper

const helper1 = styled.mixin<{ foo: string }>`
  color: ${(props) => props.foo};
`;

const helper2 = styled.mixin<{ foo?: string }>`
  color: ${(props) => props.foo};
`;

const helper3 = styled.mixin`
  color: blue;
`;
