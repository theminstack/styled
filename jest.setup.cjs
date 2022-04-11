require('@testing-library/jest-dom/extend-expect');

jest.mock('./src/server-context', () => {
  const { createBrowserContext } = jest.requireActual('./src/browser-context');
  return { createServerContext: createBrowserContext };
});

beforeEach(() => {
  require('./src/context').context.reset();
  document.head.innerHTML = '';
});
