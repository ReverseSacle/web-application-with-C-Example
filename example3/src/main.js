const path = require('node:path');
const { app, BrowserWindow, Menu, MenuItem, ipcMain, Notification, session } = require('electron/main');
const { fileSave } = require('./common/func');
let mainWindow;

function createMenu()
{
  const newMenu = new Menu();

  const dlpMenu = new MenuItem({
    label: 'Develop Tool',
    accelerator: 'F12',
    click: () => { mainWindow.webContents.toggleDevTools(); }
  })
  newMenu.append(dlpMenu);

  const freshMenu = new MenuItem({
    label: '刷新',
    accelerator: 'F5',
    click: () => { mainWindow.webContents.reload(); }
  });
  newMenu.append(freshMenu);

  const reloadMenu = new MenuItem({
    label: 'Reload',
    accelerator: 'F5',
    click: () => { mainWindow.reload(); }
  });
  newMenu.append(reloadMenu);

  const homeMenu = new MenuItem({
    label: 'Home',
    click: () => { mainWindow.loadFile(path.join(__dirname,'index.html')); }
  })
  newMenu.append(homeMenu);

  Menu.setApplicationMenu(newMenu);
}

function createWindow() 
{
  createMenu()

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    }
  });

  mainWindow.loadFile(path.join(__dirname,'index.html'));

  mainWindow.webContents.on('devtools-closed', () => {
    mainWindow.webContents.closeDevTools();
  });

  /********************************** 加载新链接 **********************************/
  mainWindow.webContents.on('new-window', (event, url) => {
    // 在同一个窗口中加载新链接
    event.preventDefault(); // 阻止默认行为，即打开新窗口
    mainWindow.loadURL(url);
  });

  mainWindow.webContents.on('will-navigate', (event, url) => {
    event.preventDefault();
    mainWindow.loadURL(url);
  });
  
  mainWindow.webContents.on('dom-ready', () => {
    mainWindow.webContents.executeJavaScript(`
      document.querySelectorAll('a[target="_blank"]').forEach(link => {
        link.removeAttribute('target');
      });
    `);
  });
  /********************************** 加载新链接 **********************************/
}

app.whenReady().then(() => {
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0';
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });

  if (!mainWindow) { createWindow(); }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) { createWindow(); }
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') { app.quit(); }
  });

  ipcMain.on('show-notification', (event, arg) => {
    const notification = new Notification(arg);
    notification.show();
  });
});