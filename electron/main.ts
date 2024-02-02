import { app, BrowserWindow, screen, ipcMain } from 'electron'
const fs = require('fs').promises;
const path = require('path');


// Logic for reading directory
// Helper function to capitalize the first letter of a month's name
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const monthNames = {
  "01": "January", "02": "February", "03": "March", "04": "April",
  "05": "May", "06": "June", "07": "July", "08": "August",
  "09": "September", "10": "October", "11": "November", "12": "December"
};

ipcMain.handle('read-directory', async (event, basePath) => {
  const hashTable = {};
  try {
    const directories = await fs.readdir(basePath, { withFileTypes: true });
    for (const directory of directories) {
      if (directory.isDirectory()) {
        // Match the directory name to the "YYYY-MM" pattern
        const dirMatch = directory.name.match(/^(\d{4})-(\d{2})$/);
        if (dirMatch) {
          const year = dirMatch[1];
          const month = dirMatch[2];
          const monthName = monthNames[month];
          if (monthName) {
            const formattedDirName = `${year} - ${monthName}`;
            const dirPath = path.join(basePath, directory.name);
            const filesInDir = await fs.readdir(dirPath, { withFileTypes: true });
            const mdFiles = {};

            for (const file of filesInDir) {
              if (file.isFile()) {
                // Match the file name to the "monthName-DD.md" pattern
                const fileMatch = file.name.match(/^(\w+)-(\d{2})\.md$/);
                if (fileMatch) {
                  const fileMonthName = capitalize(fileMatch[1]);
                  const fileDay = fileMatch[2];
                  // Check if the month name from the file matches the directory's month name
                  if (fileMonthName.toLowerCase() === monthName.toLowerCase()) {
                    const formattedFileName = `${fileMonthName} - ${fileDay}`;
                    const filePath = path.join(dirPath, file.name);
                    mdFiles[formattedFileName] = filePath;
                  }
                }
              }
            }

            if (Object.keys(mdFiles).length > 0) {
              hashTable[formattedDirName] = mdFiles;
            }
          }
        }
      }
    }
    console.log("HashTable:", hashTable); // Log for debugging
    return hashTable;
  } catch (error) {
    console.error('Error reading directory:', error);
    throw error;
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
