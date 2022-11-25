/* eslint-disable no-undef */
require('@testing-library/jest-dom/extend-expect');
const { defaultStyledManager } = require('./src/api/manager.tsx');
const { defaultStyledCache } = require('./src/api/cache.tsx');
const { TextEncoder } = require('node:util');

window.TextEncoder = TextEncoder;

beforeEach(() => {
  document.head.innerHTML = '';
  defaultStyledManager.reset();
  defaultStyledCache.reset();
});
