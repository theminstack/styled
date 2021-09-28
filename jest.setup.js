require('@testing-library/jest-dom/extend-expect');

beforeEach(() => {
  while (document.head.lastChild) {
    document.head.removeChild(document.head.lastChild);
  }

  jest.useFakeTimers();
  jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => setTimeout(cb, 0));
  jest.spyOn(window, 'cancelAnimationFrame').mockImplementation((handle) => clearTimeout(handle));
});
