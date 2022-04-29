vmtemplateserver
======

## 介绍
这是一款开箱即用的社交项目服务端项目，包括账户登录注册，角色权限，反馈，附件，分类，职业，发帖，评论，关注，签到，简单的商品订单逻辑等

同时集成了支付宝支付，三方IM处理功能


## 准备
运行本项目前确认你已配置好`nodejs`开发环境，并且已安装`mongodb`，如果不熟悉可以参考以下两篇文章：
- [Nvm 管理 Nodejs](https://mp.weixin.qq.com/s/MN_fhfw32FPj6rWs8Gdsyw)
- [Ubuntu 安装并配置 Mongodb](https://mp.weixin.qq.com/s/0CpwuH7XbpKU6ZsiOtrc6Q)


## 开发部署

**配置说明**
`config`目录下添加了几个配置模板，需要自己根据需要复制相应的文件进行配置，复制文件后删除模板文件中的`template`即可，如` config.local.template.js`->`config.local.js`
```
config.local.template.js // 本地调试配置模板
config.pre.template.js // 线上调试配置模板
config.prod.template.js // 线上运行配置模板
config.unittest.template.js // 单元测试配置模板
```

**本地开发**
```
# 创建本地运行配置文件 config.local.js 修改配置文件内相关信息为自己的
$ cp config.local.template.js config.local.js
# 终端运行
$ npm i
$ npm run dev
$ open http://localhost:5920/

# 也可以导入`WebStorm`进行编译运行，工具栏选择 `Run->Edit Configurations` 添加 `npm` 运行，其中 `Scripts` 填 `debug`or`dev`
```

**接口调试**
这里方便大家调试，我把我的 `postman` 数据导出来了，大家可以导入到自己 `postman` 进行测试，接口文件放在了项目根目录下 `vmnepentheserver.postman.json`
不会用 `postman` 的话自行搜索下吧，很简单很方便

这里需要注意导入的只是接口数据，环境配置需要你自己进行配置，主要就是 `{{host}}` `{{Authorization}}` 这两个参数


**上线发布**
```
# 创建发布运行配置文件 config.prod.js 修改配置文件内相关信息为自己的
$ cp config.prod.template.js config.prod.js
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

### 域名配置
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


### Nginx 代理配置
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


## 更多
**移动端**
- [Github/VMNepentheAndroid](https://github.com/lzan13/VMNepentheAndroid)
- [Gitee/VMNepentheAndroid](https://gitee.com/lzan13/VMNepentheAndroid)

**项目介绍说明**
- [Android功能介绍](https://mp.weixin.qq.com/s/bZYNCkngSuYpYJfdwFFYlw)
- [服务器介绍说明](https://mp.weixin.qq.com/s/1D0VllcyolPL1ei7Ix9hfw)

- [更新记录](./UPDATE.md)


## 交流
QQ群: 901211985  个人QQ: 1565176197 公众号: 穿裤衩闯天下
<div align="center">
    <img src="./images/wechatSubscribeGreen.jpg" width="855px" height="312px" alt="公众号: 穿裤衩闯天下"/>
</div>

<div align="center">
    <img src="./images/imGroup.jpg" width="256px" height="316.5px" alt="QQ 交流群"/>
    <img src="./images/qqQR1565176197.jpg" width="256px" height="316.5px" alt="个人 QQ"/>
</div>


## 支持赞助
如果你觉得当前项目帮你节省了开发时间，想要支持赞助我的话👍，可以扫描下方的二维码打赏请我吃个鸡腿🍗，你的支持将鼓励我继续创作👨‍💻‍，感谢☺️ [赞助列表](./sponsor.md)
<div align="center">
    <img src="./images/payQRAli.jpg" width="256px" height="316.5px" alt="支付宝捐赠"/>
    <img src="./images/payQRWeChat.jpg" width="256px" height="316.5px" alt="微信捐赠"/>
</div>


## LICENSE
[MIT License Copyright (c) 2021 lzan13](./LICENSE)
