const path = require('node:path');
const fs = require('node:fs');
const koffi = require('koffi');

function fileSave()
{
    const cur_dir = process.cwd();
    const lib_dir = path.join(cur_dir,'lib');
    const lib = koffi.load(path.join(lib_dir,'savefile.dll'));
    
    const file_path = path.join(cur_dir,'log');
    if(false == fs.existsSync(file_path)) { fs.mkdir(file_path,{recursive: true},()=>{}); }
    const saveFile = lib.func('void saveFile(const char* path,const char* content)');
    saveFile(path.join(file_path,'text.txt'),'xxxx');
    console.log(file_path);
}

module.exports = {
    fileSave
};