| 目录     | 描述                                               |
| -------- | -------------------------------------------------- |
| example1 | 使用Electron编写前端桌面软件，并联用FFI来调用C函数 |
| example2 | 打包配置                                           |

## Electron

### 环境

```tex
# 删除下面的目录，没有就跳过
C:\Program Files (x86)\Nodejs
C:\Program Files\Nodejs
C:\Users{User}\AppData\Roaming\npm（或%appdata%\npm）
C:\Users{User}\AppData\Local\npm-cache
```

Node.js - `node-v18.20.1`

visual studio - 选`C++`桌面开发

### 切换网络环境

```bash
################### 本地代理git(可选，这里用不到) ######################
# socks5
# 127.0.0.1:<梯子设置中的socks端口>
git config --global http.proxy socks5://127.0.0.1:10808
git config --global https.proxy socks5://127.0.0.1:10808

# 取消
git config --global --unset http.proxy
git config --global --unset https.proxy

################### 本地代理git ######################


################### 本地npm ######################
# 取消代理
npm config delete proxy
npm config delete https-proxy

# 首先安装转换工具(socks→http)
npm install -g http-proxy-to-socks --registry https://mirrors.cloud.tencent.com/npm/

# 然后设置npm代理监听端口为8002
npm config set proxy http://127.0.0.1:8002
npm config set https-proxy http://127.0.0.1:8002

# 最后使用这个工具监听8002端口,支持http代理，需保持窗口
# 假设本地socks5代理(梯子设置中的socks端口)端口为10808
# 然后所有8002的http代理数据都将转换成socks的代理数据发送到10808上
# 梯子开全局
hpts -s 127.0.0.1:10808 -p 8002

# 淘宝镜像源（临时镜像）
--registry https://registry.npmmirror.com
################### 本地npm ######################

npm cache clean --force
```

### 过程

#### 初始化

`npm install -g npm@10.5.1`

`npm init -y` - 初始化一个Node.js项目

`npm install --save-dev electron` - 安装Electron开发依赖

#### 打包

安装electron-builder

- `npm install -g electron-builder`

- `./package.json`中添加下面的内容，`author`为作者名，`description`为应用的描述

  ```json 
    "author": "xxxx",
    "description": "test app",
  ```

- windows中打开`PowerShell`并切换(通过`cd`命令)到当前根目录

- `./package.json`中添加下面的内容

  - ```json
    "build": {
      "productName": "electron-desktop",
      "appId": "com.keliq.electron-desktop",
      "directories": {
        "output": "builder-dist"
      }
    }
    
    /********* build区域中可选配置 *********/
      "npmRebuild": false,
      "files": [
        "build/**/*",
        "public/**/*",
        "!node_modules/**/*"
      ],
      "extraResources": [
        "package_resources"
      ],
      "extraFiles": [
        {
          "from": "build/extra",
          "to": "extraFiles",
          "filter": "*.dll"
        }
      ]
    /********* build区域中可选配置 *********/
    ```

  - `productName` - 应用名，打包后`.exe`的名字

  - `appId` - 应用的包名，详细可参考安装软件的包名

  - `directories` - 输出目录，打包内容相对于当前根目录的输出位置

  - `npmRebuild` - 是否重新编译`Node.js`模块

  - `files` - 指定了哪些文件和文件夹应该被包含在最终打包的应用程序中，在文件路径前面添加`!`可排除当前文件

  - `extraResources` - 指定需要包含在应用程序包内但位于应用的`asar`包之外的额外资源

  - `extraFiles` - 指定哪些文件不放在应用目录的`resources`目录下

- 打包命令

  - `Set-ExecutionPolicy RemoteSigned` - Y

  - `electron-builder`

- extraResources 和 extraFiles 都是在构建过程中指定需要包含的文件或资源，但它们的作用略有不同。前者将资源打包到应用程序中的资源文件夹中，后者则是直接复制到应用程序的安装目录中

### 与C语言联用

- `npm install koffi` - 第三方模块ffi，允许调用动态链接库中的C函数
