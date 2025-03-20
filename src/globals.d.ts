// Define Jest globals for TypeScript
declare global {
  // Jest globals
  const describe: (name: string, fn: () => void) => void;
  const test: (name: string, fn: (done?: () => void) => void | Promise<void>) => void;
  const it: typeof test;
  const expect: any;
  const beforeAll: (fn: () => void | Promise<void>) => void;
  const beforeEach: (fn: () => void | Promise<void>) => void;
  const afterAll: (fn: () => void | Promise<void>) => void;
  const afterEach: (fn: () => void | Promise<void>) => void;
  
  // Jest mock functions
  const jest: {
    fn: <T extends (...args: any[]) => any>(
      implementation?: T
    ) => jest.MockInstance<ReturnType<T>, Parameters<T>>;
    spyOn: (
      object: any,
      method: string
    ) => jest.SpyInstance;
    mock: (moduleName: string, factory?: any) => jest.Mock;
    clearAllMocks: () => void;
    resetAllMocks: () => void;
    restoreAllMocks: () => void;
  };

  namespace jest {
    interface MockInstance<T, Y extends any[]> {
      mockImplementation: (fn: (...args: Y) => T) => MockInstance<T, Y>;
      mockReturnValue: (val: T) => MockInstance<T, Y>;
      mockReturnValueOnce: (val: T) => MockInstance<T, Y>;
      mockResolvedValue: (val: Awaited<T>) => MockInstance<Promise<Awaited<T>>, Y>;
      mockResolvedValueOnce: (val: Awaited<T>) => MockInstance<Promise<Awaited<T>>, Y>;
      mockRejectedValue: (val: any) => MockInstance<Promise<Awaited<T>>, Y>;
      mockRejectedValueOnce: (val: any) => MockInstance<Promise<Awaited<T>>, Y>;
      mockClear: () => MockInstance<T, Y>;
      mockReset: () => MockInstance<T, Y>;
      mockRestore: () => MockInstance<T, Y>;
    }

    type SpyInstance = MockInstance<any, any>;
    type Mock = MockInstance<any, any>;
  }

  // Electron window API
  interface Window {
    electron: {
      selectFiles: () => Promise<string[]>;
      saveProject: (projectData: any) => Promise<{ success: boolean; error?: string }>;
      openFile: (filePath: string) => Promise<{ success: boolean; error?: string }>;
    };
  }
}

export {}; 