import 'normalize.css';

import { StrictMode } from 'react';
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

const C = styled.div`
  ${B} {
    /* test */
    // test
    color: green;
  }
`;

const D = (props: { className?: string }) => {
  return <A className={props.className}>Is this thing on?</A>;
};

const E = styled(D)`
  color: purple;
`;

createRoot(document.body.appendChild(document.createElement('div'))).render(
  <StrictMode>
    <GlobalStyle2 />
    <C>
      <B $foo="test">Hello, World!</B>
    </C>
    <E />
    <GlobalStyle />
  </StrictMode>,
);
