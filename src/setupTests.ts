// Jest setup file
import "@testing-library/jest-dom";

// Set up fake timers globally
global.beforeEach(() => {
  jest.useFakeTimers();
});

global.afterEach(() => {
  jest.clearAllTimers();
  jest.useRealTimers();
});
