VMServer
======
这是为`VMMatch`项目实现的服务端

## 简介
这个项目分为以下部分

- [server](./) 服务逻辑及 API 接口实现
- [client](./client) Web 前端界面，和 server 端放置在同一仓库下（暂未实现）
- [Android](https://github.com/lzan13/VMMatch) Android 端（开发中）

## 使用

### 首先环境配置
1. 安装 nodejs å
2. 需要安装 mongodb 并启动
3. 下载项目到服务器，可以下载压缩包，或者用`git`命令`clone`
4. 复制`config_default.js`到`config.js`
5. 安装依赖 
```
npm install
```
6. 全局安装pm2 
```
npm install pm2 -g
```
7. 运行 vmshell.sh