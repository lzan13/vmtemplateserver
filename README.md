vmnepentheserver
======

忘忧服务端接口项目，包括账户登录注册，角色权限管理，附件管理，分类，职业，发帖，评论，关注等

忘忧 — 忘掉烦恼，解除忧愁，分享快乐，传播正能量😁

### 介绍
单纯的吐槽已经无法满足现如今人们发泄内心的压抑，我们需要交流
同时有些不方便和朋友说，所以需要和陌生人交流
单纯的收发消息无法满足我们交流的欲望，我们需要更丰富的交流方式
在这里你可以化身心灵导师，解答别人的烦恼，你也可以倾诉自己的忧愁！
来吧，这里或许有你想要的呢！


运行本项目前确认你已配置好`nodejs`开发环境，并且已安装`mongodb`，可以参考一下两篇文章：
- [Nvm 管理 Nodejs](https://blog.melove.net/develop-config-nvm-manager-nodejs/)
- [Ubuntu 安装并配置 Mongodb](https://blog.melove.net/develop-config-ubuntu-install-mongodb/)


## 配置说明
`config`目录下添加了几个配置模板，需要自己根据需要复制相应的文件进行配置，复制文件后删除模板文件中的`template`即可，如` config.local.template.js`->`config.local.bak.js`
```
config.local.template.js // 本地调试配置模板
config.pre.template.js // 线上调试配置模板
config.prod.template.js // 线上运行配置模板
config.unittest.template.js // 单元测试配置模板

```

## 本地开发调试

```
# 创建本地运行配置文件 config.local.bak.js 修改配置文件内相关信息为自己的
$ cp config.local.template.js config.local.js
# 终端运行
$ npm i
$ npm run dev
$ open http://localhost:5920/

# 也可以导入`WebStorm`进行编译运行，工具栏选择 `Run->Edit Configurations` 添加 `npm` 运行，其中 `Scripts` 填 `debug`or`dev`
```


## 构建部署
```
# 创建发布运行配置文件 config.prod.js 修改配置文件内相关信息为自己的
$ cp config.prod.template.js config.prod.js
$ cp config.unittest.template.js config.unittest.js
# 安装发布依赖
$ npm i --production
# 打包发布代码
$ tar -czvf ../vmnepentheserver.tgz .

# 将打包的代码上传到要发布的服务器上，解包，运行
$ tar -xzvf vmnepentheserver.tgz .
$ ./vmrun.sh
# 完成之后运行单元测试初始化数据库
$ npm run test
```


## 域名配置
项目部署完成之后，默认只能通过`ip+port`来访问，一般正常项目都需要配置访问域名，这里我使用`nginx`说下我的配置，不一样的同学可以自己搜索所用服务器相关配置
```
# 首先进到 nginx 配置目录下，我的是 /etc/nginx/sites-available 下
$ cd /etc/nginx/sites-available
# 新建并编辑配置，这个名字可以随便取，内容参考下方配置
$ vim match
# 保存之后需要连接当前配置到 /etc/nginx/sites-enabled/ 下
$ ln -s /etc/nginx/sites-available/match /etc/nginx/sites-enabled/match
# 重启 nginx
$ /etc/init.d/nginx restart
```


### nginx 代理配置
这里开启了`https`访问，证书用的是阿里云免费证书，一年有效期，到期需要自己更新，怎么申请免费证书不再赘述，记得修改其中的域名为自己的
```
server {
        listen 80;
        server_name 你自己的域名;

        rewrite ^(.*)$ https://$host$1 permanent;
}
server {
        listen 443 ssl;
        server_name 你自己的域名;

        ssl on;

        ssl_certificate         /var/www/certs/你自己的证书.pem;
        ssl_certificate_key     /var/www/certs/你自己的证书.key;
        ssl_ciphers             ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
        ssl_protocols           TLSv1 TLSv1.1 TLSv1.2;
        ssl_prefer_server_ciphers on;
        # 这里如果开启了子目录路由配置，应该写成子目录路径 比如/api
        location / {
                proxy_set_header   Upgrade $http_upgrade;
                proxy_set_header   Connection "upgrade";
                proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header   X-Real-IP $remote_addr;
                proxy_set_header   Host $http_host;
                proxy_set_header   X-Forwarded-Proto $scheme;
                proxy_pass         http://127.0.0.1:5920;
        }
}
```


## 调试接口
这里方便大家调试，我把我的 `postman` 数据导出来了，大家可以导入到自己 `postman` 进行测试，接口文件放在了项目根目录下 `vmnepentheserver.postman.json`
不会用 `postman` 的话自行搜索下吧，很简单很方便

这里需要注意导入的只是接口数据，环境配置需要你自己进行配置，主要就是 `{{host}}` `{{Authorization}}` 这两个参数


## 更多
- 移动端 [Github/VMNepentheAndroid](https://github.com/lzan13/VMNepentheAndroid) [Gitee/VMNepentheAndroid](https://gitee.com/lzan13/VMNepentheAndroid)
- 项目整体介绍说明 [项目介绍](https://blog.melove.net/develop-open-source-app-and-server-template/)
- [更新记录](./UPDATE.md)

## 交流
QQ群: 901211985  个人QQ: 1565176197
<div align="center">
    <img src="https://gitee.com/lzan13/VMPictureBed/raw/master/images/dev/imGroup.jpg" width="256px" height="316.5px" alt="QQ 交流群"/>
    <img src="https://gitee.com/lzan13/VMPictureBed/raw/master/images/social/qqQR1565176197.jpg" width="256px" height="316.5px" alt="个人 QQ"/>
</div>


## 支持赞助
如果你觉得当前项目帮你节省了开发时间，想要支持赞助我的话👍，可以扫描下方的二维码打赏请我吃个鸡腿🍗，你的支持将鼓励我继续创作👨‍💻‍，感谢☺️ [赞助列表](./sponsor.md)
<div align="center">
    <img src="https://gitee.com/lzan13/VMPictureBed/raw/master/images/social/payQRAli.jpg" width="256px" height="316.5px" alt="支付宝捐赠"/>
    <img src="https://gitee.com/lzan13/VMPictureBed/raw/master/images/social/payQRWeChat.jpg" width="256px" height="316.5px" alt="微信捐赠"/>
</div>


## LICENSE
[MIT License Copyright (c) 2021 lzan13](./LICENSE)
