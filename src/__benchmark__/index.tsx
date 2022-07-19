import 'normalize.css';
import './index.css';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { StrictMode } from 'react';
import { render } from 'react-dom';

import { App } from './components/app';

const rootElement = document.body.appendChild(document.createElement('div'));

rootElement.setAttribute('id', 'root');
render(
  <StrictMode>
    <App />
  </StrictMode>,
  rootElement,
);
