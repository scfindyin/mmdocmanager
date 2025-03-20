import { contextBridge, ipcRenderer } from 'electron';

// Define result type for file operations
interface OperationResult {
  success: boolean;
  error?: string;
}

// Extend the File interface to include Electron's path property
// We need to use a different approach to extend the File interface
interface ElectronFile extends File {
  path: string;
}

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electron',
  {
    selectFiles: () => ipcRenderer.invoke('select-files'),
    saveProject: (projectData: any) => ipcRenderer.invoke('save-project', projectData),
    openFile: (filePath: string) => ipcRenderer.invoke('open-file', filePath),
  }
);

// We need to declare the API types for TypeScript
declare global {
  interface Window {
    electron: {
      selectFiles: () => Promise<string[]>;
      saveProject: (projectData: any) => Promise<OperationResult>;
      openFile: (filePath: string) => Promise<OperationResult>;
    };
  }
} 