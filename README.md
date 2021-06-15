# vmtemplateserver

一个使用`Eggjs`开发的服务器模板项目，包含了比较完整的用户信息处理、角色管理、分类、职业、发帖、匹配、评论、关注、喜欢 等功能


### 本地开发调试
开发调试前请确保你已配置好`nodejs`开发环境，并且已安装`mongodb`，可以参考一下两篇文章：
- [Nvm 管理 Nodejs](https://blog.melove.net/develop-config-nvm-manager-nodejs/)
- [Ubuntu 安装并配置 Mongodb](https://blog.melove.net/develop-config-ubuntu-install-mongodb/)

```bash
# 创建本地运行配置文件 config.local.js 修改配置文件内相关信息为自己的
$ cp config.local.template.js config.local.js
# 终端运行
$ npm i
$ npm run dev
$ open http://localhost:5920/

# 也可以导入`WebStorm`进行编译运行，工具栏选择 `Run->Edit Configurations` 添加 `npm` 运行，其中 `Scripts` 填 `debug`or`dev`
```

### 构建部署
```bash
# 创建发布运行配置文件 config.prod.js 修改配置文件内相关信息为自己的
$ cp config.prod.template.js config.prod.js
# 安装发布依赖
$ npm install --production
# 打包发布代码
$ tar -czvf vmtemplateserver.tgz .

# 将打包的代码上传到要发布的服务器上，解包，运行
$ tar -xzvf vmtemplateserver.tgz .
$ ./vmrun.sh
```
> 服务器首次部署完成，需要调用 `/admin/init` 接口进行数据初始化


### 更多
移动端 [Github/VMTemplateAndroid](https://github.com/lzan13/VMTemplateAndroid) [Gitee/VMTemplateAndroid](https://gitee.com/lzan13/VMTemplateAndroid)

点击 [eggjs](https://eggjs.org) 了解更多`eggjs`开发配置相关细节
