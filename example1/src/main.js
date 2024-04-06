const path = require('node:path');
const { app, BrowserWindow, Menu, MenuItem } = require('electron/main');
const { fileSave } = require('../lib/func');
let mainWindow;

function createMenu()
{
  const newMenu = new Menu();
  /*********************** File ***********************/
  const fileMenu = new MenuItem({
    label: 'File',
    submenu: []
  });

  fileMenu.submenu.append(new MenuItem({
    label: 'FileSave',
    accelerator: 'Ctrl+S',
    click: () => { fileSave(); }
  }));
  newMenu.append(fileMenu);
  /*********************** File ***********************/

  const dlpMenu = new MenuItem({
    label: 'Develop Tool',
    accelerator: 'F12',
    click: () => { 
      mainWindow.webContents.toggleDevTools(); 
    }
  })
  newMenu.append(dlpMenu);

  Menu.setApplicationMenu(newMenu);
}

function createWindow () 
{
  createMenu()

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.webContents.on('devtools-closed', () => {
    mainWindow.webContents.closeDevTools();
  });

  mainWindow.loadFile(path.join(__dirname,'index.html'));
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') { app.quit(); }
});