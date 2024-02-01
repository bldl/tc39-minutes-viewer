import { app, BrowserWindow, screen, ipcMain } from 'electron'
const fs = require('fs').promises;
const path = require('path');


// Logic for reading directory
ipcMain.handle('read-directory', async (event, basePath) => {
  const hashTable = {};
  try {
    const directories = await fs.readdir(basePath, { withFileTypes: true });
    for (const directory of directories) {
      if (directory.isDirectory()) {
        // Directory name as date key
        const dirName = directory.name;
        const dirPath = path.join(basePath, dirName);
        const filesInDir = await fs.readdir(dirPath, { withFileTypes: true });
        const mdFiles = {};

        for (const file of filesInDir) {
          if (file.isFile() && file.name.endsWith('.md')) {
            // Use file's date (or name) as key, and file path as value
            const fileName = file.name;
            // Assuming file names can be directly used as date keys
            // Adjust this logic if file names need parsing or formatting
            const filePath = path.join(dirPath, fileName);
            mdFiles[fileName] = filePath;
          }
        }

        hashTable[dirName] = mdFiles; // Assign directory of MD files to the date key
      }
    }
    console.log(hashTable); // Optional: Log to verify structure
    return hashTable;
  } catch (error) {
    console.error('Error reading directory:', error);
    throw error; // Rethrow or handle as needed
  }
});
// End


// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')


let win: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  win = new BrowserWindow({
    width,
    height,
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    
    
  })
  win.webContents.openDevTools();
  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)
