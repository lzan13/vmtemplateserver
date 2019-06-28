VMServer
======
是为`Android`开源项目`VMMatch`项目（中文名`猿匹配`）实现的服务端


### 简介
这个项目包含两部分

- 根目录：服务逻辑及`API`接口实现
- `client`目录：前端界面，和服务器端代码端放置在同一仓库下（暂未实现）


### 使用
简单介绍下运行环境及部署方法

1. 安装`nodejs`开发时使用的是`v10.16.0`版本
2. 需要安装`mongodb`并启动，开发使用版本`4.0.10`
3. 下载项目到服务器，可以下载压缩包，或者用`git clone`命令
4. 复制`config_default.js`到`config.js`，可根据自己需要修改配置文件
5. 安装依赖 
```
npm install
```
6. 全局安装pm2 
```
npm install pm2 -g
```
7. 运行 vmshell.sh


### 关联项目
基于环信 IM 实现的包含聊天功能的项目
[Android 客户端](https://github.com/lzan13/VMMatch) Android 客户端（开发中）

[博客介绍](https://blog.melove.net/develop-open-source-im-match-and-server/)
