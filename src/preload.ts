import { contextBridge, ipcRenderer } from 'electron';

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
      saveProject: (projectData: any) => Promise<void>;
      openFile: (filePath: string) => Promise<void>;
    };
  }
} 