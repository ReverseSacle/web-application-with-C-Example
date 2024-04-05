const path = require('node:path')
const { app, BrowserWindow, ipcMain, nativeTheme, Menu, MenuItem } = require('electron/main')
const { fileSave } = require('./lib/func')

let mainWindow;
const cur_dir = __dirname
const menu = new Menu()

menu.append(new MenuItem({
    label: 'File',
    submenu: [{
      label: 'SaveFile',
      accelerator: 'Ctrl+S',
      click: () => { fileSave(cur_dir,mainWindow) }
    }]
}))

Menu.setApplicationMenu(menu)

function createWindow() 
{
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(cur_dir, 'preload.js')
        }
    })

    mainWindow.loadFile('index.html')
}

ipcMain.handle('dark-mode:toggle', () => {
    if (nativeTheme.shouldUseDarkColors) { nativeTheme.themeSource = 'light' } 
    else { nativeTheme.themeSource = 'dark' }

    return nativeTheme.shouldUseDarkColors
})

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (0 === BrowserWindow.getAllWindows().length) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})