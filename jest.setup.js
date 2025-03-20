// jest-dom adds custom jest matchers for asserting on DOM nodes.
require('@testing-library/jest-dom');

// Mock TipTap's BubbleMenu which requires a real DOM
jest.mock('@tiptap/extension-bubble-menu', () => ({
  __esModule: true,
  default: () => {
    return {
      name: 'bubbleMenu',
      addProseMirrorPlugins() {
        return [];
      },
    };
  },
}));

// Mock TipTap's FloatingMenu which requires a real DOM
jest.mock('@tiptap/extension-floating-menu', () => ({
  __esModule: true,
  default: () => {
    return {
      name: 'floatingMenu',
      addProseMirrorPlugins() {
        return [];
      },
    };
  },
}));

// Mock Electron API
global.window.electron = {
  selectFiles: jest.fn(),
  selectDirectories: jest.fn(),
  saveProject: jest.fn(),
};

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
}); 