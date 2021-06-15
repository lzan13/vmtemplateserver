/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   */
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1594006394883_6206';

  /**
   * 配置端口
   */
  config.cluster = {
    listen: {
      path: '',
      port: 5920,
      hostname: '127.0.0.1',
    },
  };

  /**
   * 配置中间件
   */
  config.middleware = [ 'errorHandler', 'auth' ];

  /**
   * 权限认证配置
   */
  config.auth = {
    // 是否启用中间件，默认为 false
    enable: true,
    // 设置符合某些规则的请求不经过这个中间件，和 match 互斥，同时只能配置一个
    ignore: [ '/api/admin/init', /^\/api\/sign\/(in|up|activate)/, '/public/uploads', '/api/test/' ],
    // 设置只有符合某些规则的请求才会经过这个中间件。
    // match: [ '' ],
    // 这里配置的是对应角色无权限访问的接口正则匹配
    noPermission: {
      god: '',
      admin: '',
      operation: '',
      // 普通用户不允许操作管理员接口，以及不能直接操作：类别、职业、角色、用户、签到相关数据，可通过对外暴露的对应接口操作，比如更新用户资料等
      user: /^\/api\/(admin|category|clock|profession|role|user)/,
      lock: '',
    },
  };

  /**
   * jwt 配置，这里主要用来生成和解析 token，验证交由上边自定义的 auth 中间件
   */
  config.jwt = {
    // 是否启用中间件，默认为 false
    enable: false,
    // 自定义 JWT 加密 token 需要的 secret
    secret: 'vm_server_123456',
    // 设置符合某些规则的请求不经过这个中间件，和 match 互斥，同时只能配置一个
    ignore: [ '/api/admin/init', /^\/api\/sign\/(in|up|activate)/, '/public/uploads', '/api/test/' ],
    // match: '/jwt',
  };

  /**
   * bcrypt 配置
   */
  config.bcrypt = {
    saltRounds: 10, // default 10
  };

  /**
   * 支持文件类型配置
   */
  config.multipart = {
    fileExtensions: [ '.apk', '.pptx', '.docx', '.csv', '.doc', '.ppt', '.pdf', '.pages', '.wav', '.mov' ], // 增加对 .apk 扩展名的支持
  };


  /**
   * 参数过滤配置
   */
  config.parameters = {
    logParameters: true,
    // param names that you want filter in log.
    filterParameters: [ 'token' ],
  };

  /**
   * 接口安全配置
   */
  config.security = {
    csrf: {
      enable: false,
    },
    domainWhiteList: [ 'http://localhost:5920' ],
  };

  /**
   * 接口安全配置
   */
  config.validate = {
    convert: false,
    widelyUndefined: true,
  };

  /**
   * ------------------------------------------------------------------
   * 以下配置需要根据自己实际情况进行修改
   */

  /**
   * 配置 alinode 监控，这里本地调试暂时随便填写，正式环境另外配置
   */
  config.alinode = {
    appid: 'alinode appId',
    secret: 'alinode secret',
  };

  /**
   * Easemob 配置，后台地址 https://console.easemob.com/app/im-service/detail
   */
  config.easemob = {
    host: 'http://a1.easemob.com', // 环信 API 请求接口，在环信后台查看
    orgName: 'orgName', // 环信 appKey 前半段
    appName: 'appName', // 环信 appkey 后半段
    clientId: 'client id', // 替换环信后台 clientId
    clientSecret: 'client secret', // 替换环信后台 clientSecret
  };

  /**
   * 邮箱配置
   */
  config.mail = {
    config: {
      host: 'smtp.exmail.qq.com', // 主机地址，这里使用的是腾讯企业邮箱
      port: 465,
      secure: true,
      auth: {
        user: '你自己的邮箱',
        pass: '邮箱密码', // 这个密码要根据邮箱后台确认是使用账户密码，还是客户端独有的密码
      },
    },
    from: 'VMLoft<notify@vmloft.com>', // from 表示邮件发送者，必须与认证账户相同
    activateSubject: '【社交系统】验证电子邮件地址',
    activateContent: '<div style="width:100%; background-color:#f6f7f8; margin: 0; padding: 0; font-family: Roboto-Regular,Helvetica,Arial,sans-serif; font-size: 14px;"><div style="width: 100%; height: 36px;"></div><div style="min-width: 360px; max-width: 600px; margin: 20px auto; background-color: #fff; box-shadow: 0px 5px 15px #f8f8f8"><div style="font-size: 22px; text-align:center; border-bottom: #eee 1px solid; margin: 0 16px"><div style="padding: 24px;">【社交系统】验证电子邮件地址</div></div><div style="width: 100%; text-align: left;  background-color: #ffffff;"><div style="min-width: 320px; max-width: 500px; margin: auto; color: #232323; line-height: 1.5; padding: 8px 0;"><div style="font-size: 18px; font-weight: bold; padding: 24px 16px;">尊敬的{0}您好！</div><div style="padding: 16px;">感谢您使用我们的服务，这里需要验证下您的电子邮件地址，点击下方的按钮以验证电子邮箱：</div><div style="padding: 8px 16px;"><a href="{1}/sign/activate?verify={2}">验证电子邮件地址</a></div><div style="padding: 16px;">如果您并没进行此类操作请忽略此邮件！</div><div style="color:#999999; padding: 24px 16px; text-align: end">社交系统团队</div></div></div><div style="margin:0 16px; padding: 16px; color: #999999; text-align:center; border-top: #eee 1px solid">©️2021社交系统.</div></div><div style="width: 100%; height: 36px;"></div></div>',
    codeSubject: '【社交系统】验证码',
    codeContent: '<div style="width:100%; background-color:#f6f7f8; margin: 0; padding: 0; font-family: Roboto-Regular,Helvetica,Arial,sans-serif; font-size: 14px;"><div style="width: 100%; height: 36px;"></div><div style="min-width: 360px; max-width: 600px; margin: 20px auto; background-color: #fff; box-shadow: 0px 5px 15px #f8f8f8"><div style="font-size: 22px; text-align:center; border-bottom: #eee 1px solid; margin: 0 16px"><div style="padding: 24px;">【社交系统】验证码</div></div><div style="width: 100%; text-align: left;  background-color: #ffffff;"><div style="min-width: 320px; max-width: 500px; margin: auto; color: #232323; line-height: 1.5; padding: 8px 0;"><div style="font-size: 18px; font-weight: bold; padding: 24px 16px;">尊敬的{0}您好！</div><div style="padding: 16px;">感谢您使用我们的服务，您正在进行敏感操作，下边是您请求的验证码</div><div style="padding: 8px 16px;"><strong style="color: #ff7138; font-size: 20px;font-weight: bold;">{1}</strong></div><div style="padding: 16px;">如果您并没进行此类操作请忽略此邮件！</div><div style="color:#999999; padding: 24px 16px; text-align: end">社交系统团队</div></div></div><div style="margin:0 16px; padding: 16px; color: #999999; text-align:center; border-top: #eee 1px solid">©️2021社交系统.</div></div><div style="width: 100%; height: 36px;"></div></div>',
  };

  /**
   * Mongoose 配置，服务器数据库需要验证
   */
  config.mongoose = {
    client: {
      url: 'mongodb://127.0.0.1:27017/vmtemplate', // 未开启验证的链接方式
      // url: 'mongodb://template:123456@127.0.0.1:27017/vmtemplate', // 开启验证的链接方式
      options: {
        bufferMaxEntries: 0,
        useFindAndModify: false,
        useUnifiedTopology: true,
      },
    },
  };

  // 数据配置
  const dataConfig = {
    // 部署服务地址，TODO 正式发布时需要改成你的域名地址
    host: 'http://localhost:5920',
    // 配置邮箱注册账户是否需要激活
    isNeedActivate: false,
    // 上传文件夹
    uploadDir: 'app/public/uploads',
    // 配置超管账户
    username: 'template',
    email: 'template@vmloft.com',
    password: '123123',
    // 系统信息
    title: '模板服务器',
    desc: '使用 Eggjs 实现自定义模板服务器',
    // 角色身份配置
    roleList: [
      {
        title: '超级管理员',
        desc: '掌控整个系统的生死',
        identity: 999,
      },
      {
        title: '管理员',
        desc: '拥有管理普通用户及部分系统功能的人员',
        identity: 888,
      },
      {
        title: '运营',
        desc: '负责站点运营管理',
        identity: 777,
      },
      {
        title: '普通账户',
        desc: '享有使用系统及分享内容的权利，受到系统保护',
        identity: 9,
      },
      {
        title: '锁定用户',
        desc: '因特殊原因被锁定账户，暂不可用系统服务',
        identity: 2,
      },
      {
        title: '永久删除用户',
        desc: '因特殊原因被删除账户，永不解封',
        identity: 1,
      },
    ],
    // 分类配置
    categoryList: [
      {
        title: '聊天交友',
        desc: '嗨，我想和你做朋友，感兴趣的看过来',
      },
      {
        title: '心情分享',
        desc: '吐槽不快，分享快乐，一起哭，一起笑吧',
      },
      {
        title: '无聊摸鱼',
        desc: '闲的卵疼，来吹吹水、摸摸鱼啊',
      },
    ],
    // 职业配置
    professionList: [
      {
        title: '搬砖滴',
        desc: '上学不努力，长大去搬砖',
      },
      {
        title: '种田滴',
        desc: '劳动者是最美滴人，是生活的基石',
      },
      {
        title: '学生娃',
        desc: '未来的花朵，要好好爱护，努力加油',
      },
      {
        title: '家庭主妇/夫',
        desc: '为家庭舍弃自己的梦想，嗯',
      },
      {
        title: '上班族',
        desc: '为生活不断努力打拼，面包会有的，房子车子都会有的',
      },
      {
        title: '自由职业',
        desc: '无忧无虑，自由工作',
      },
      {
        title: '大老板',
        desc: '成功人士，快要走向人生巅峰了',
      },
      {
        title: '退休享福',
        desc: '我还可以燃烧，为社会奉献余热',
      },
      {
        title: '神秘职业',
        desc: '你问我是做什么的，不可说！',
      },
    ],
  };
  return {
    ...config,
    ...dataConfig,
  };
};
