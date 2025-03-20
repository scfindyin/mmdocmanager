import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

// These are globals defined by Electron Forge / Webpack
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;

let mainWindow: BrowserWindow | null = null;

const createWindow = (): void => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // Load the index.html file.
  if (MAIN_WINDOW_WEBPACK_ENTRY) {
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  }

  // Open the DevTools in development.
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// File system operations will be handled here
ipcMain.handle('select-files', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: 'Documents', extensions: ['pdf', 'doc', 'docx', 'xls', 'xlsx'] }
    ]
  });
  
  if (!result.canceled) {
    return result.filePaths;
  }
  return [];
});

ipcMain.handle('save-project', async (event, projectData) => {
  try {
    // TODO: Implement project saving logic
    return { success: true };
  } catch (error: unknown) {
    console.error('Error saving project:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to save project';
    return { 
      success: false, 
      error: errorMessage 
    };
  }
});

ipcMain.handle('open-file', async (event, filePath) => {
  try {
    const { shell } = require('electron');
    const fs = require('fs');
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return { 
        success: false, 
        error: 'File does not exist or has been moved' 
      };
    }
    
    // Get file extension
    const ext = filePath.split('.').pop()?.toLowerCase();
    
    // Define supported file types (can be expanded)
    const supportedTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png', 'gif', 'txt'];
    
    if (ext && !supportedTypes.includes(ext)) {
      return { 
        success: false, 
        error: `File type "${ext}" may not be supported by your system` 
      };
    }
    
    // Attempt to open the file with the default application
    const openResult = await shell.openPath(filePath);
    
    // shell.openPath returns empty string on success, or an error message
    if (openResult) {
      return { 
        success: false, 
        error: openResult 
      };
    }
    
    return { success: true };
  } catch (error: unknown) {
    console.error('Error opening file:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to open file';
    return { 
      success: false, 
      error: errorMessage
    };
  }
}); 