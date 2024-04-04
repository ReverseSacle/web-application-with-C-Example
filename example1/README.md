## Electron

### 环境

Node.js - `node-v18.20.1`

`npm install -g npm@latest`

### 过程

#### 初始化

`npm init -y` - 初始化一个Node.js项目

`npm install --save-dev electron` - 安装Electron开发依赖

#### 打包

安装Electron Forge

- `npm install --save-dev @electron-forge/cli`

- `npx electron-forge import`

  ```json ./packate.json
    "description": "test app",
    "authors": "ReverseSacle",
  ```

- `npm install @electron-forge/plugin-fuses --save-dev`

- `npm run make`



## 与C/C++联用

`npm install -g node-gyp`

`npm i ffi-rs` - 第三方模块ffi，允许调用动态链接库中的C函数
