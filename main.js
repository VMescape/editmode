const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const htmlDocx = require('html-docx-js');
const pdf = require('html-pdf');

let mainWindow = null;
let fileToOpen = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    title: 'EditMode',
    icon: path.join(__dirname, 'icon.png'),
    show: false,
    autoHideMenuBar: true
  });

  mainWindow.loadFile('index.html');

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    if (fileToOpen) {
      mainWindow.webContents.send('file-opened', fileToOpen);
      fileToOpen = null;
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
    app.quit();
  });
}

// Set the app icon for macOS dock
if (process.platform === 'darwin') {
  app.dock.setIcon(path.join(__dirname, 'icon.png'));
}

function handleFileOpen(filePath) {
  if (mainWindow) {
    if (mainWindow.webContents.isLoading()) {
      fileToOpen = filePath;
    } else {
      mainWindow.webContents.send('file-opened', filePath);
    }
  } else {
    fileToOpen = filePath;
  }
}

// Handle file open events
app.on('will-finish-launching', () => {
  app.on('open-file', (event, filePath) => {
    event.preventDefault();
    handleFileOpen(filePath);
  });
});

// Handle command line arguments for file opening
if (process.platform !== 'darwin') {
  const filePath = process.argv[1];
  if (filePath) {
    fileToOpen = filePath;
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// File dialog handlers
ipcMain.on('open-file-dialog', async (event) => {
  try {
    const { filePaths } = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile'],
      filters: [{ name: 'Word Documents', extensions: ['docx'] }]
    });

    if (filePaths?.[0]) {
      handleFileOpen(filePaths[0]);
    }
  } catch (error) {
    console.error('Error opening file dialog:', error);
  }
});

async function generatePDF(content, outputPath) {
  return new Promise((resolve) => {
    const options = {
      format: 'Letter',
      border: {
        top: '40px',
        right: '40px',
        bottom: '40px',
        left: '40px'
      },
      footer: {
        height: '20mm'
      },
      type: 'pdf'
    };

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.5;
            color: #323130;
          }
          * {
            box-sizing: border-box;
          }
        </style>
      </head>
      <body>${content}</body>
      </html>
    `;

    pdf.create(htmlContent, options).toFile(outputPath, (error) => {
      if (error) {
        console.error('Error generating PDF:', error);
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

async function saveFile(content, format) {
  try {
    const filters = {
      'docx': [{ name: 'Word Document', extensions: ['docx'] }],
      'pdf': [{ name: 'PDF Document', extensions: ['pdf'] }],
      'html': [{ name: 'HTML Document', extensions: ['html'] }]
    };

    const { filePath } = await dialog.showSaveDialog(mainWindow, {
      filters: filters[format]
    });

    if (!filePath) return false;

    switch (format) {
      case 'docx':
        const docx = htmlDocx.asBlob(content);
        fs.writeFileSync(filePath, Buffer.from(await docx.arrayBuffer()));
        break;
      case 'pdf':
        await generatePDF(content, filePath);
        break;
      case 'html':
        fs.writeFileSync(filePath, content);
        break;
      default:
        return false;
    }

    return true;
  } catch (error) {
    console.error('Error saving file:', error);
    return false;
  }
}

ipcMain.on('save-file', async (event, { content, format }) => {
  try {
    const success = await saveFile(content, format);
    mainWindow.webContents.send('save-complete', success);
  } catch (error) {
    console.error('Error in save-file handler:', error);
    mainWindow.webContents.send('save-complete', false);
  }
}); 