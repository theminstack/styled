require('@testing-library/jest-dom/extend-expect');

const { _keyCounts } = require('./src/react/useStyle');
const { _styleTokensCache } = require('./src/react/useStyleTokens');

beforeEach(() => {
  while (document.head.lastChild) {
    document.head.removeChild(document.head.lastChild);
  }
  Object.keys(_keyCounts).forEach((key) => {
    delete _keyCounts[key];
  });
  Object.keys(_styleTokensCache).forEach((key) => {
    delete _styleTokensCache[key];
  });
  jest.useFakeTimers();
  jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
    setTimeout(cb, 0);
  });
  jest.spyOn(window, 'cancelAnimationFrame').mockImplementation((handle) => clearTimeout(handle));
});
