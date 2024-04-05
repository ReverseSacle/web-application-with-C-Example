const fs = require('fs')
const path = require('node:path')
const { load, DataType, open, close } = require('ffi-rs')

function fileSave(cur_dir,mainWindow)
{
    const lib_path = path.join(cur_dir,'lib')
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

module.exports = {
    fileSave
}