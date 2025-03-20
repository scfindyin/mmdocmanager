import '@testing-library/jest-dom';

// Mock electron API for tests
window.electron = {
  selectFiles: jest.fn().mockResolvedValue([]),
  saveProject: jest.fn().mockResolvedValue({ success: true }),
  openFile: jest.fn().mockResolvedValue({ success: true }),
};

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
}); 