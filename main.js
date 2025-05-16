const { app, BrowserWindow, ipcMain, dialog, globalShortcut } = require('electron');
const path = require('path');
const fs = require('fs');
const { Document, Paragraph, TextRun, Packer } = require('docx');
const pdf = require('html-pdf');
const XLSX = require('xlsx');

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

  // Handle window focus/blur for shortcuts
  mainWindow.on('focus', () => {
    registerShortcuts();
  });

  mainWindow.on('blur', () => {
    globalShortcut.unregisterAll();
  });

  mainWindow.on('closed', () => {
    globalShortcut.unregisterAll();
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
      filters: [
        { name: 'Documents', extensions: ['docx', 'xlsx', 'xls'] },
        { name: 'Word Documents', extensions: ['docx'] },
        { name: 'Excel Spreadsheets', extensions: ['xlsx', 'xls'] }
      ]
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
      type: 'pdf',
      // Add performance options
      timeout: 30000, // 30 second timeout
      renderDelay: 100, // Wait for dynamic content
      quality: 100, // High quality
      phantomPath: require('phantomjs-prebuilt').path, // Use phantomjs-prebuilt for better performance
      // Add better error handling
      error: (error) => {
        console.error('PDF generation error:', error);
        resolve(false);
      }
    };

    // Create a clean HTML document with proper DOCTYPE and encoding
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.5;
            color: #323130;
            margin: 0;
            padding: 0;
        }
        * {
            box-sizing: border-box;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 0;
            padding: 0;
        }
        td, th {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        @media print {
            body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
        }
    </style>
</head>
<body>
    ${content}
</body>
</html>`;

    // Generate PDF directly from the HTML content
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

async function saveFile(content, format, headers) {
  try {
    const filters = {
      'docx': [{ name: 'Word Document', extensions: ['docx'] }],
      'xlsx': [{ name: 'Excel Spreadsheet', extensions: ['xlsx'] }],
      'pdf': [{ name: 'PDF Document', extensions: ['pdf'] }],
      'html': [{ name: 'HTML Document', extensions: ['html'] }]
    };

    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
      filters: filters[format]
    });

    // If user canceled the dialog, return null to indicate cancellation
    if (canceled || !filePath) return null;

    switch (format) {
      case 'docx': {
        function createDocxElements(node) {
          if (node.type === 'paragraph') {
            return new Paragraph({
              children: node.children.map(child => createDocxElements(child))
            });
          }

          if (node.type === 'text') {
            const textRunOptions = {
              text: node.text,
              size: 24, // 12pt
            };

            if (node.bold) textRunOptions.bold = true;
            if (node.italic) textRunOptions.italic = true;
            if (node.underline) textRunOptions.underline = {};

            return new TextRun(textRunOptions);
          }

          // Handle nested children
          if (node.children && node.children.length > 0) {
            return node.children.map(child => createDocxElements(child));
          }

          return null;
        }

        // Create the document
        const doc = new Document({
          sections: [{
            properties: {},
            children: content.children.map(child => createDocxElements(child)).flat().filter(Boolean),
          }],
        });

        // Generate and save the document
        const buffer = await Packer.toBuffer(doc);
        fs.writeFileSync(filePath, buffer);
        break;
      }
      case 'xlsx': {
        // Create a new workbook
        const workbook = XLSX.utils.book_new();
        
        // Convert the data to a worksheet
        const worksheet = XLSX.utils.aoa_to_sheet(content);
        
        // Add the worksheet to the workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        
        // Write the workbook to file
        XLSX.writeFile(workbook, filePath);
        break;
      }
      case 'pdf': {
        await generatePDF(content, filePath);
        break;
      }
      case 'html': {
        fs.writeFileSync(filePath, content);
        break;
      }
      default:
        return false;
    }

    return true;
  } catch (error) {
    console.error('Error saving file:', error);
    return false;
  }
}

ipcMain.on('save-file', async (event, { content, format, headers }) => {
  try {
    const result = await saveFile(content, format, headers);
    // Only send save-complete if there was an actual save attempt
    // (result will be null if user canceled)
    if (result !== null) {
      mainWindow.webContents.send('save-complete', result);
    }
  } catch (error) {
    console.error('Error in save-file handler:', error);
    mainWindow.webContents.send('save-complete', false);
  }
});

// Update the registerShortcuts function to check if window exists and is focused
function registerShortcuts() {
  if (!mainWindow || !mainWindow.isFocused()) return;

  // Unregister any existing shortcuts first
  globalShortcut.unregisterAll();

  // Save shortcut (Cmd+S or Ctrl+S)
  globalShortcut.register(process.platform === 'darwin' ? 'CommandOrControl+S' : 'Control+S', () => {
    if (mainWindow && mainWindow.isFocused()) {
      mainWindow.webContents.send('trigger-shortcut', 'save');
    }
  });

  // New file shortcut (Cmd+N or Ctrl+N)
  globalShortcut.register(process.platform === 'darwin' ? 'CommandOrControl+N' : 'Control+N', () => {
    if (mainWindow && mainWindow.isFocused()) {
      mainWindow.webContents.send('trigger-shortcut', 'new');
    }
  });

  // Open file shortcut (Cmd+O or Ctrl+O)
  globalShortcut.register(process.platform === 'darwin' ? 'CommandOrControl+O' : 'Control+O', () => {
    if (mainWindow && mainWindow.isFocused()) {
      mainWindow.webContents.send('trigger-shortcut', 'open');
    }
  });
} 