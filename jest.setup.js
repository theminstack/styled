/* eslint-disable no-undef */
beforeEach(() => {
  // Mock browser animation functions.
  jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => setTimeout(cb, 0));
  jest.spyOn(window, 'cancelAnimationFrame').mockImplementation((handle) => clearTimeout(handle));
});
