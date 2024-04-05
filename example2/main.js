const path = require('node:path')
const { app, BrowserWindow, ipcMain, nativeTheme, Menu, MenuItem } = require('electron/main')
const { fileSave } = require('./lib/func')

let mainWindow;
let devToolsOpened = false;
const cur_dir = __dirname

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

function createMenu()
{
    const menu = new Menu()

    /**********************File**********************/
    const fileMenu = new MenuItem({
        label: 'File',
        submenu: []
    })

    fileMenu.submenu.append(new MenuItem({
        label: 'SaveFile',
        accelerator: 'Ctrl+S',
        click: () => { fileSave(cur_dir,mainWindow) }
    }))

    menu.append(fileMenu)
    /**********************File**********************/

    const f12Menu = new MenuItem({
        label: 'F12',
        click: () => { mainWindow.webContents.toggleDevTools() }
    })
    menu.append(f12Menu)
    mainWindow.webContents.on('devtools-closed', () => {
        mainWindow.webContents.closeDevTools();
    })

    const f5Menu = new MenuItem({
        label: 'F5',
        click: () => { mainWindow.webContents.reload() }
    })
    menu.append(f5Menu)

    Menu.setApplicationMenu(menu)
}

ipcMain.handle('dark-mode:toggle', () => {
    if (nativeTheme.shouldUseDarkColors) { nativeTheme.themeSource = 'light' } 
    else { nativeTheme.themeSource = 'dark' }

    return nativeTheme.shouldUseDarkColors
})

app.whenReady().then(() => {
    createWindow()
    createMenu()

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