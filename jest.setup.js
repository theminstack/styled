require('@testing-library/jest-dom/extend-expect');

beforeEach(() => {
  require('./src/react/useStyle')._refs.clear();
  require('./src/react/useStyleTokens')._refs.clear();

  while (document.head.lastChild) {
    document.head.removeChild(document.head.lastChild);
  }

  jest.useFakeTimers();
  jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => setTimeout(cb, 0));
  jest.spyOn(window, 'cancelAnimationFrame').mockImplementation((handle) => clearTimeout(handle));
});
