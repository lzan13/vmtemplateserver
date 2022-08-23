vmnepentheserver
======

> 看完之后回来做个小问卷吧，帮助我促进项目的完善 [忘忧项目使用问卷](https://wenjuan.feishu.cn/m?t=s5qrpiqR87Di-4emr)

### 介绍

忘忧大陆-修仙一样交友

分担忧愁，让烦恼减半 分享快乐，让乐趣加倍

帮助用户解决烦恼，忘记忧愁，放松心情，快乐交友等打造一站式社交平台，弹幕式心情分享，及新颖的即时聊天方式，带给用户不一样的交流体验，让用户之间的交流充满趣味性，提高心情愉悦度，达到忘记烦恼的目的。

<div align="center">
    <img src="./assets/images/banner.jpg" width="855px" height="427.5px" alt="banner"/>
</div>

### 环境配置
首先说下服务运行的软硬件环境，主要是服务器，数据库，以及http反向代理
- 服务器，可以是任何可运行代码编译环境（物理机、VPS、自己的电脑、等）都可以，我这里远端主要是使用Ubuntu本地调试用自己的电脑
    - Ubuntu V16.04.6 LTS
- 数据库，这里用到了两个
    - MongoDB 所有数据存储 V4.2.8
    - Redis 长链接缓存 V3.0.6
- Nginx 反向代理+静态网页服务 V1.10.3
- Nodejs 服务器运行 V14.19.1

### 目录结构
```
vmnepentheserver
├── app
│   ├── controller // 用户输入与输出
│   |   ├── xxx.js // 其它处理
│   |   └── user.js
│   ├── extend // 框架扩展
│   |   ├── context.js // 扩展 ctx
│   |   └── helper.js // 帮助类
│   ├── io
│   |   ├── controller.js // socket 控制器
│   |   |   └── im.js // socket 数据包入口
│   |   └── middleware.js // socket 中间件
│   |       ├── connection.js // 链接中间件，只是做个分发
│   |       └── packet.js // 数据包处理中间件，目前没啥啊处理
│   ├── middleware // 中间件
│   |   ├── auth.js // 身份认证
│   |   └── error_hander.js // 错误处理
│   ├── model // 数据库模型
│   |   ├── xxx.js // 其它模型
│   |   └── user.js // 用户模型
│   ├── router // 路由
│   |   ├── admin.js // 管理员路由配置
│   |   ├── common.js // 公用路由配置
│   |   ├── im.js // im 路由配置
│   |   ├── info.js // 用户信息路由配置
│   |   └── user.js // 登录注册路由配置
│   ├── schedule // 定时任务
│   |   └── dayTask.js // 每天执行的定时任务
│   |   └── monthTask.js // 每月执行的定时任务
│   |   └── weekTask.js // 每周执行的定时任务
│   ├── service // 业务逻辑服务
│   |   ├── xxx.js // 其它逻辑服务
│   |   └── user.js // 用户逻辑服务
│   ├── validator	// 自定义参数校验规则
│   |   ├── content.js // 内容信息校验规则
│   |   └── user.js // 用户信息校验规则
|   └── router.js // 路由配置
├── config // 配置目录，需要自己根据模板复制出对应环境的配置文件
|   ├── config.default.js
|   ├── config.local.js
│   ├── config.local.template.js // 本地环境配置模板
│   ├── config.pre.js
│   ├── config.pre.template.js // 预发环境配置模板
│   ├── config.prod.js
│   ├── config.prod.template.js // 线上环境配置模板
|   ├── config.unittest.js
|   ├── config.unittest.template.js 	// 单元测试配置模板
|   └── plugin.js // 插件配置
├── test // 单元测试
│   └── service // 服务相关单元测试文件，这里并没有实现详细的单元测试，主要用作数据库初始化
|       ├── category.test.js
|       ├── commodity.test.js
|       ├── config.test.js
|       ├── profession.test.js
|       ├── role.test.js
|       └── version.test.js
├── app.js // 入口类，可以做一些初始化操作
├── package.json // 依赖配置文件
├── vmrun.sh // 启动脚本
└──vmtemplateserver.postman_collection.json // postman 接口导出文件，可直接导入 postman 进行接口测试
```

### 配置说明
`config`目录下添加了几个配置模板，所有待配置信息都能在config.default.js文件中找到，不同环境配置只是将其中部分配置的值进行修改，根据实际需要进行修改就行，需要自己根据需要复制相应的文件进行配置，复制文件后删除模板文件中的`template`即可，如` config.local.template.js`->`config.local.js`
PS：不论开发调试和上线发布，第一步都需要进行数据初始化，这个只需要执行一次就好

```
config.local.template.js // 本地调试配置模板
config.pre.template.js // 线上调试配置模板
config.prod.template.js // 线上运行配置模板
config.unittest.template.js // 单元测试配置模板
```
所有待配置信息都能在config.default.js文件中找到，不同环境配置只是将其中部分配置的值进行修改，根据实际需要进行修改就行
PS：不论开发调试和上线发布，第一步都需要进行数据初始化，这个只需要执行一次就好
### 本地开发

```
# 运行单元测试初始化数据库
$ cp config.unittest.template.js config.unittest.js
$ npm run test

# 创建本地运行配置文件 config.local.js 修改配置文件内相关信息为自己的
$ cp config.local.template.js config.local.js
# 终端运行
$ npm i
$ npm run dev
$ open http://localhost:5920/

# 也可以导入`WebStorm`进行编译运行，工具栏选择 `Run->Edit Configurations` 添加 `npm` 运行，其中 `Scripts` 填 `debug`or`dev`
```

### 上线发布

```
# 运行单元测试初始化数据库
$ cp config.unittest.template.js config.unittest.js
$ npm run test

# 创建发布运行配置文件 config.prod.js 修改配置文件内相关信息为自己的
$ cp config.prod.template.js config.prod.js
# 安装发布依赖
$ npm i --production
# 打包发布代码
$ tar -czvf ../vmnepentheserver.tgz .

# 将打包的代码上传到要发布的服务器上，解包，运行
$ tar -xzvf vmnepentheserver.tgz .
$ ./vmrun.sh
```

### 域名配置

项目部署完成之后，默认只能通过`ip+port`来访问，一般正常项目都需要配置访问域名，这里我使用`nginx`说下我的配置，不一样的同学可以自己搜索所用服务器相关配置

```
# 首先进到 nginx 配置目录下，我的是 /etc/nginx/sites-available 下
$ cd /etc/nginx/sites-available
# 新建并编辑配置，这个名字可以随便取，内容参考下方配置
$ vim nepenthe
# 保存之后需要连接当前配置到 /etc/nginx/sites-enabled/ 下
$ ln -s /etc/nginx/sites-available/nepenthe /etc/nginx/sites-enabled/nepenthe
# 重启 nginx
$ /etc/init.d/nginx restart
```

### Nginx 代理配置

这里开启了`https`访问，证书用的是阿里云免费证书，一年有效期，到期需要自己更新，怎么申请免费证书不再赘述，记得修改其中的域名为自己的

```
server {
	listen 80;
	server_name nepenthe.vmloft.com;

	rewrite ^(.*)$ https://$host$1 permanent;
}
server {
	listen 443 ssl;
	server_name nepenthe.vmloft.com;

	ssl on;

	ssl_certificate /var/www/certs/nepenthe.vmloft.com.pem;
	ssl_certificate_key /var/www/certs/nepenthe.vmloft.com.key;
	#ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
	ssl_ciphers ALL:!ADH:!EXPORT56:RC4+RSA:+HIGH:+MEDIUM:+LOW:+SSLv2:+EXP;
	#ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
	ssl_protocols TLSv1 TLSv1.1 TLSv1.2 SSLv2 SSLv3;
	ssl_prefer_server_ciphers on;
	ssl_verify_client off;

    // 正向代理配置（静态站点）
	location / {
		root /var/www/vmnepenthe/home;
		index index.html;
		try_files $uri $uri/ = index;
	}
	// 正向代理配置（静态站点）
	location /admin {
		alias /var/www/vmnepenthe/admin;
		index index.html
		try_files $uri $uri/ = 404;
	}
    // 反向代理配置（rest api 接口）
	location /api {
		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection "upgrade";
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header X-Real-IP $remote_addr;
		proxy_set_header Host $http_host;
		proxy_set_header X-Forwarded-Proto $scheme;
		proxy_pass http://127.0.0.1:5920;
	}
	// 反向代理WebSocket
    location /im {
        proxy_pass http://127.0.0.1:5920;
        proxy_http_version 1.1;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $http_host;

        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-NginX-Proxy true;

        proxy_redirect off;
        proxy_buffering off;
    }
}
```

### 接口调试
这里方便大家调试，我把我的 `postman` 数据导出来了，大家可以导入到自己 `postman` 进行测试，接口文件放在了项目根目录下 `vmnepentheserver.postman.json`
不会用 `postman` 的话自行搜索下吧，很简单很方便

这里需要注意导入的只是接口数据，环境配置需要你自己进行配置，主要就是 `{{host}}` `{{Authorization}}` 这两个参数

### 更多

总体介绍 [忘忧大陆项目整体介绍](https://www.yuque.com/lzan13/nepenthe/ypa51f)
开发迭代 [更新记录](./UPDATE.md)

**项目客户端下载体验**

- [本地 APK 包下载](http://app.melove.net/fwn)
- [GooglePlay 市场下载](https://play.google.com/store/apps/details?id=com.vmloft.develop.app.nepenthe)

**开源仓库地址**

- [gitee/VMTemplateAndroid](https://gitee.com/lzan13/VMTemplateAndroid) Android 客户端
- [gitee/vmtemplateadmin](https://gitee.com/lzan13/vmtemplateadmin) 管理端项目使用`vue3`+`vite`+`element-plus`
- [gitee/vmtemplatehome](https://gitee.com/lzan13/vmtemplatehome) 首页端项目使用`vue3`+`vite`
- [gitee/vmtemplateserver](https://gitee.com/lzan13/vmtemplateserver) 服务器端项目使用`eggjs`

- [github/VMTemplateAndroid](https://github.com/lzan13/VMTemplateAndroid) Android 客户端
- [github/vmtemplateadmin](https://github.com/lzan13/vmtemplateadmin) 管理端项目使用`vue3`+`vite`+`element-plus`
- [github/vmtemplatehome](https://github.com/lzan13/vmtemplatehome) 首页端项目使用`vue3`+`vite`
- [github/vmtemplateserver](https://github.com/lzan13/vmtemplateserver) 服务器端项目使用`eggjs`

**沟通交流**

可以通过以下方式找到我，获取最新信息，以及技术支持

公众号: 穿裤衩闯天下

<div align="center">
    <img src="./assets/images/wechatSubscribeGreen.jpg" width="570px" height="208px" alt="公众号: 穿裤衩闯天下"/>
</div>

QQ 群: 901211985 个人 QQ: 1565176197

<div align="center">
    <img src="./assets/images/imGroup.jpg" width="256px" height="316.5px" alt="QQ 交流群"/>
    <img src="./assets/images/qqQR1565176197.jpg" width="256px" height="316.5px" alt="个人 QQ"/>
</div>

**支持赞助**

如果你觉得当前项目帮你节省了开发时间，想要支持赞助我的话 👍，可以扫描下方的二维码打赏请我吃个鸡腿 🍗，你的支持将鼓励我继续创作 👨‍💻‍，感谢 ☺️ [赞助列表](./sponsor.md)

<div align="center">
    <img src="./assets/images/payQRAli.jpg" width="256px" height="316.5px" alt="支付宝捐赠"/>
    <img src="./assets/images/payQRWeChat.jpg" width="256px" height="316.5px" alt="微信捐赠"/>
</div>

### LICENSE

[MIT License Copyright (c) 2022 lzan13](./LICENSE)
