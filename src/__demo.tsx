import 'normalize.css';

import { type ReactNode, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { styled } from './index.js';

const GlobalStyle = styled.global`
  body {
    color: #ccc;
    background-color: #000;
    font-family: Arial, Helvetica, sans-serif;
  }

  body > div {
    font-size: 1.25rem;
  }
`;

const GlobalStyle2 = styled.global`
  padding: 2rem;
`;

const A = styled('div')`
  color: blue;
`;

const B = styled(A)<{ $foo: string }>`
  color: red;
  margin: ${null};
`;

const C = styled.div.withConfig({ displayName: 'Foo' })`
  ${B} {
    /* test */
    // test
    color: green;
  }
`;

const D = (props: { children?: ReactNode; className?: string }) => {
  return <A className={props.className}>{props.children}</A>;
};

const E = styled(D)`
  color: purple;
`;

createRoot(document.body.appendChild(document.createElement('div'))).render(
  <StrictMode>
    <GlobalStyle2 />
    <B $foo="test">Red</B>
    <C>
      <B $foo="test">Green</B>
    </C>
    <E>Purple</E>
    <GlobalStyle />
  </StrictMode>,
);
