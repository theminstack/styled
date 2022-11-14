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

const Component = styled('div')`
  color: cyan;
`;

createRoot(document.body.appendChild(document.createElement('div'))).render(
  <StrictMode>
    <GlobalStyle />
    <Component>Hello, World!</Component>
  </StrictMode>,
);
