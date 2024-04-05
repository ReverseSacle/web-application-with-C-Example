const { app, BrowserWindow, globalShortcut, ipcMain, nativeTheme, Menu, MenuItem } = require('electron/main')
const path = require('node:path')
const fs = require('fs')
const { load, DataType, open, close } = require('ffi-rs')

const menu = new Menu()
const cur_dir = __dirname
const lib_path = path.join(cur_dir,'lib');

let mainWindow;
open({
    library: 'savefile',
    path: path.join(lib_path,'savefile.dll')
})

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

function fileSave()
{
    const save_path = path.join(cur_dir,'log')
    console.log(save_path)
    if(false == fs.existsSync(save_path)){ fs.mkdir(save_path, { recursive: true },() => {}) }

    mainWindow.webContents.executeJavaScript(`document.getElementById('textblock').value;`)
    .then(value => {
        open({
            library: 'savefile',
            path: path.join(lib_path,'savefile.dll')
        })
        load({
            library: 'savefile',
            funcName: 'saveFile',
            retType: DataType.Void,
            paramsType: [DataType.String,DataType.String],
            paramsValue: [path.join(save_path,'test.txt'),value]
        })
        close('savefile')
    })
}

menu.append(new MenuItem({
    label: 'File',
    submenu: [{
      label: 'SaveFile',
      accelerator: 'Ctrl+S',
      click: () => { fileSave() }
    }]
}))

Menu.setApplicationMenu(menu)

ipcMain.handle('dark-mode:toggle', () => {
    if (nativeTheme.shouldUseDarkColors) { nativeTheme.themeSource = 'light' } 
    else { nativeTheme.themeSource = 'dark' }

    return nativeTheme.shouldUseDarkColors
})

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') 
    {
        app.quit()
    }
})