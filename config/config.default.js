/**
 * 项目默认配置项，如有需要改动的，不要在这里直接改动，复制对应项到相对应的环境配置文件进行修改
 */

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
    // [ '/v1/init', /^\/v1\/(sign\/(in|up|activate))/, '/v1/feedback', '/v1/test/', '/public/uploads' ],
    ignore: /\/v1\/(sign\/(in|up|activate)|third)/,
    // 设置只有符合某些规则的请求才会经过这个中间件。
    // match: [ '' ],
    // 这里配置的是对应角色无权限访问的接口正则匹配
    noPermission: {
      god: '',
      admin: '',
      operation: '',
      /**
       * 普通用户不允许操作管理员接口，以及不能直接操作：
       * 类别、签到、验证码、商品、配置、订单、职业、角色、用户、版本 等相关接口，
       * 可通过对外暴露的对应接口操作，比如更新用户资料等
       */
      user: /\/v1\/(category|clock|code|commodity|config|profession|role|user|version)/,
      lock: '',
    },
  };

  /**
   * 上传文件支持配置，下便是默认支持的格式
   * // images
   * '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.wbmp', '.webp', '.tif', '.psd',
   * // text
   * '.svg', '.js', '.jsx', '.json', '.css', '.less', '.html', '.htm', '.xml',
   * // tar
   * '.zip', '.gz', '.tgz', '.gzip',
   * // voice
   * '.mp3',
   * // video
   * '.mp4', '.avi',
   * binary: [ '.7z', '.apk', '.gz', '.gzip', '.rar', '.tgz', '.zip' ],
   * document: [ '.csv', '.doc', '.docx', '.pdf', '.ppt', '.pptx', '.xls', '.xlsx', '.key', '.numbers', '.pages', '.json', '.txt' ],
   * image: [ '.gif', '.ico', '.jpg', '.jpeg', '.png', 'svg', '.webp' ],
   * voice: [ '.amr', '.mp3', '.ogg' ],
   * video: [ '.avi', '.mp4' ],
   */
  config.multipart = {
    // 增加对 apk 扩展名的文件支持
    fileExtensions: [ '.7z', '.apk', '.rar', '.doc', '.docx', '.pdf', '.ppt', '.pptx', '.xls', '.xlsx', '.key', '.numbers', '.pages', '.txt', '.ico', '.amr', '.ogg' ],
    // 覆盖整个白名单，只允许上传 '.png' 格式，注意：当重写了 whitelist 时，fileExtensions 不生效。
    // whitelist: [ '.png' ],
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
    // [ '/v1/admin/init', /^\/api\/sign\/(in|up|activate)/, '/v1/feedback', '/v1/test/', '/public/uploads' ],
    ignore: '',
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
  config.validate = {
    convert: false,
    widelyUndefined: true,
  };

  /**
   * ------------------------------------------------------------------
   * 以下配置需要根据自己实际情况进行修改
   */

  /**
   * 接口安全配置
   */
  config.security = {
    csrf: {
      enable: false,
    },
    domainWhiteList: [ 'http://localhost:5920' ], // '前端网页托管的域名'
  };

  /**
   * 配置 alinode 监控，这里本地调试暂时随便填写，正式环境另外配置
   */
  config.alinode = {
    appid: 'alinode appId',
    secret: 'alinode secret',
  };

  /**
   * Easemob IM 配置 https://console.easemob.com/app/im-service/detail
   */
  config.easemob = {
    host: 'http://a1.easemob.com', // 环信 API 请求接口，在环信后台查看
    orgName: 'orgName', // 环信 appKey # 前半段
    appName: 'appName', // 环信 appkey # 后半段
    clientId: 'client id', // 替换环信后台 clientId
    clientSecret: 'client secret', // 替换环信后台 clientSecret
  };

  /**
   * Easemob MQTT 配置 https://console.easemob.com/app/generalizeMsg/overviewService
   */
  config.mqtt = {
    host: 'mqtt host', // MQTT 链接地址
    appId: 'appId', // MQTT AppId
    port: [ 1883, 1884, 80, 443 ], // MQTT 端口 1883(mqtt),1884(mqtts),80(ws),443(wss)
    restHost: 'rest API', // MQTT 服务 API 地址
    clientId: 'client id', // 替换环信后台 clientId
    clientSecret: 'client secret', // 替换环信后台 clientSecret
  };

  /**
   * 云服务相关配置
   */
  config.upyun = {
    bucket: '', // 又拍云服务名，即存储空间名，其他平台也叫存储桶
    operator: '', // 又拍云对象存储操作员名称
    password: '', // 又拍云对象存储操作员密码
  };

  /**
   * 聚合平台相关配置
   */
  config.ads = {
    secKeyCN: '', // TopOn聚合平台国内回调安全密钥
    secKey: '', // TopOn聚合平台海外回调安全秘钥
    mintegralSecKeyCN: '', // Mintegral 平台国内回调安全秘钥
    mintegralSecKey: '', // Mintegral 平台海外回调安全秘钥
  };

  /**
   * 支付相关配置
   */
  config.pay = {
    alipayAppId: 'APP Id', // alipay app Id
    alipayEncryptKey: 'AES 秘钥', // alipay AES 秘钥
    alipayPrivateKey: '私钥', // alipay 私钥
    alipayPublicKey: '公钥', // alipay 公钥
    alipayGateway: 'https://openapi.alipaydev.com/gateway.do', // alipay 网关
    format: 'JSON', // 格式类型
    charset: 'utf-8', // 编码类型
    signType: 'RSA2', // 签名类型
    version: '1.0', // 版本 1.0
    notifyUrl: '', // 通知回调地址
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
    from: '你自己的邮箱', // from 表示邮件发送者，必须与认证账户相同
    activateSubject: '【社交系统】验证电子邮件地址',
    activateContent: '<div style="width:100%; background-color:#f6f7f8; margin: 0; padding: 0; font-family: Roboto-Regular,Helvetica,Arial,sans-serif; font-size: 14px;"><div style="width: 100%; height: 36px;"></div><div style="min-width: 360px; max-width: 600px; margin: 20px auto; background-color: #fff; box-shadow: 0px 5px 15px #f8f8f8"><div style="font-size: 22px; text-align:center; border-bottom: #eee 1px solid; margin: 0 16px"><div style="padding: 24px;">【社交系统】验证电子邮件地址</div></div><div style="width: 100%; text-align: left;  background-color: #ffffff;"><div style="min-width: 320px; max-width: 500px; margin: auto; color: #232323; line-height: 1.5; padding: 8px 0;"><div style="font-size: 18px; font-weight: bold; padding: 24px 16px;">尊敬的{0}您好！</div><div style="padding: 16px;">感谢您使用我们的服务，这里需要验证下您的电子邮件地址，点击下方的按钮以验证电子邮箱：</div><div style="padding: 8px 16px;"><a href="{1}/account/activate?verify={2}">验证电子邮件地址</a></div><div style="padding: 16px;">如果您并没进行此类操作请忽略此邮件！</div><div style="color:#999999; padding: 24px 16px; text-align: end">社交系统团队</div></div></div><div style="margin:0 16px; padding: 16px; color: #999999; text-align:center; border-top: #eee 1px solid">©️2021社交系统.</div></div><div style="width: 100%; height: 36px;"></div></div>',
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
    // 部署服务地址，正式发布时需要改成你的域名地址
    host: 'http://localhost:5920',
    // 是否配置站点二级目录下，默认关闭，这个只有你需要配置二级站点时才开启
    subSite: false,
    // 启用二级站点后，二级站点目录路径，这里需要和你站点代理配置一致
    subSitePath: '/api',
    // 配置邮箱注册账户是否需要激活
    isNeedActivate: false,
    super: { // 配置超管账户
      email: 'admin@vmloft.com',
      username: 'admin',
      password: '123123',
    },
    siteList: [{ // 系统配置信息
      alias: 'nepenthe',
      title: '忘忧服务系统',
      desc: '忘忧服务数据管理系统，包含完整的社交逻辑处理',
    }, {
      alias: 'agreement',
      title: '用户协议',
      desc: '用户协议配置信息，这里可以配置隐私政策地址，也可以配置 html 内容',
      content: 'https://nepenthe.melove.net/#/agreement',
    }, {
      alias: 'policy',
      title: '隐私政策',
      desc: '隐私政策配置信息，这里可以配置隐私政策地址，也可以配置 html 内容',
      content: 'https://nepenthe.melove.net/#/policy',
    }, {
      alias: 'norm',
      title: '用户行为规范',
      desc: '用户行为规范配置信息，这里可以配置隐私政策地址，也可以配置 html 内容',
      content: 'https://nepenthe.melove.net/#/norm',
    }, {
      alias: 'client',
      title: '客户端配置信息',
      desc: '客户端所需配置信息，Json 格式，方便灵活配置',
      content: '',
    }],
    categoryList: [{ // 分类配置
      title: '吐槽广场',
      desc: '这里有好多人，来一起吐槽吧',
    }, {
      title: '聊天交友',
      desc: '嗨，我想和你做朋友，感兴趣的看过来',
    }, {
      title: '心情分享',
      desc: '倾诉不快，分享快乐，一起哭，一起笑吧',
    }, {
      title: '无聊摸鱼',
      desc: '闲的慌吗，来吹吹水、摸摸鱼啊',
    }],
    // 商品配置，这里主要是充值的虚拟商品
    commodityList: [{ // 开通会员商品
      title: '月度会员',
      desc: '尊享多重会员独享服务',
      price: '10.00',
      currPrice: '8.88',
      inventory: '999999',
      status: 1,
      type: 1,
      level: 1,
      remarks: '订阅会员服务',
    }, {
      title: '季度会员',
      desc: '尊享多重会员独享服务',
      price: '30.00',
      currPrice: '25.50',
      inventory: '999999',
      status: 1,
      type: 1,
      level: 3,
      remarks: '订阅会员服务',
    }, {
      title: '年度会员',
      desc: '尊享多重会员独享服务',
      price: '120.00',
      currPrice: '96.00',
      inventory: '999999',
      status: 1,
      type: 1,
      level: 12,
      remarks: '订阅会员服务',
    }, { // 金币充值商品
      title: '充值 200 忘忧币',
      desc: '首冲体验',
      price: '1.00',
      currPrice: '1.00',
      inventory: '999999',
      status: 1,
      type: 0,
      remarks: '忘忧币充值',
    }, {
      title: '充值 600 忘忧币',
      desc: '限时9.2折',
      price: '6.00',
      currPrice: '5.52',
      inventory: '999999',
      status: 1,
      type: 0,
      remarks: '忘忧币充值',
    }, {
      title: '充值 1800 忘忧币',
      desc: '限时9.0折',
      price: '18.00',
      currPrice: '16.20',
      inventory: '999999',
      status: 1,
      type: 0,
      remarks: '忘忧币充值',
    }, {
      title: '充值 3600 忘忧币',
      desc: '限时8.8折',
      price: '36.00',
      currPrice: '31.68',
      inventory: '999999',
      status: 1,
      type: 0,
      remarks: '忘忧币充值',
    }, {
      title: '充值 7200 忘忧币',
      desc: '限时7.9折',
      price: '72.00',
      currPrice: '56.88',
      inventory: '999999',
      status: 1,
      type: 0,
      remarks: '忘忧币充值',
    }, {
      title: '充值 12800 忘忧币',
      desc: '限时7.5折',
      price: '128.00',
      currPrice: '96.00',
      inventory: '999999',
      status: 1,
      type: 0,
      remarks: '忘忧币充值',
    }, {
      title: '充值 25600 忘忧币',
      desc: '限时7.3折',
      price: '256.00',
      currPrice: '186.88',
      inventory: '999999',
      status: 1,
      type: 0,
      remarks: '忘忧币充值',
    }, {
      title: '充值 51200 忘忧币',
      desc: '限时7.1折',
      price: '512.00',
      currPrice: '363.52',
      inventory: '999999',
      status: 1,
      type: 0,
      remarks: '忘忧币充值',
    }, {
      title: '充值 102400 忘忧币',
      desc: '限时6.9折',
      price: '1024.00',
      currPrice: '706.56',
      inventory: '999999',
      status: 1,
      type: 0,
      remarks: '忘忧币充值',
    }, {
      title: '充值 204800 忘忧币',
      desc: '限时6.7折',
      price: '2048.00',
      currPrice: '1372.16',
      inventory: '999999',
      status: 1,
      type: 0,
      remarks: '忘忧币充值',
    }, {
      title: '充值 409600 忘忧币',
      desc: '限时6.5折',
      price: '4096.00',
      currPrice: '2662.40',
      inventory: '999999',
      status: 1,
      type: 0,
      remarks: '忘忧币充值',
    },
    {
      title: '充值 819200 忘忧币',
      desc: '限时6.3折',
      price: '8192.00',
      currPrice: '5160.96',
      inventory: '999999',
      status: 1,
      type: 0,
      remarks: '忘忧币充值',
    }],
    // 系统配置信息
    professionList: [{
      title: '搬砖滴',
      desc: '上学不努力，长大去搬砖',
    }, {
      title: '种田滴',
      desc: '劳动者是最美滴人，是生活的基石',
    }, {
      title: '学生娃',
      desc: '未来的花朵，要好好爱护，努力加油',
    }, {
      title: '家庭主妇/夫',
      desc: '为家庭舍弃自己的梦想，嗯',
    }, {
      title: '上班族',
      desc: '为生活不断努力打拼，面包会有的，房子车子都会有的',
    }, {
      title: '自由职业',
      desc: '无忧无虑，自由工作',
    }, {
      title: '大老板',
      desc: '成功人士，快要走向人生巅峰了',
    }, {
      title: '退休享福',
      desc: '我还可以燃烧，为社会奉献余热',
    }, {
      title: '神秘职业',
      desc: '你问我是做什么的，不可说！',
    }],
    // 角色身份配置
    roleList: [{
      title: '超级管理员',
      desc: '掌控整个系统的生死',
      identity: 1000,
    }, {
      title: '管理员',
      desc: '拥有管理普通用户及部分系统功能的人员',
      identity: 900,
    }, {
      title: '运营者',
      desc: '负责站点运营管理',
      identity: 800,
    }, {
      title: '检查员',
      desc: '负责站点输出内容审核',
      identity: 700,
    }, {
      title: 'VIP账户',
      desc: '享有使用系统及分享内容的权利，受到系统保护',
      identity: 100,
    }, {
      title: '普通账户',
      desc: '享有使用系统及分享内容的权利，受到系统保护',
      identity: 9,
    }, {
      title: '待激活账户',
      desc: '享有使用系统及分享内容的权利，受到系统保护',
      identity: 8,
    }, {
      title: '锁定账户',
      desc: '因特殊原因被锁定账户，暂不可用系统服务',
      identity: 2,
    }, {
      title: '黑名单账户',
      desc: '因特殊原因被删除账户，永不解封，设置为当前身份而不是删除，可以防止用户重复注册',
      identity: 1,
    }],
    // 版本配置
    versionList: [{
      platform: 0,
      title: '功能尝鲜',
      desc: '新功能上线，快来尝鲜',
      url: 'https://nepenthe.melove.net',
      versionCode: 1,
      versionName: '0.0.1',
      force: false,
    }, {
      platform: 1,
      title: '功能尝鲜',
      desc: '新功能上线，快来尝鲜',
      url: 'https://nepenthe.melove.net',
      versionCode: 1,
      versionName: '0.0.1',
      force: false,
    }, {
      platform: 2,
      title: '功能尝鲜',
      desc: '新功能上线，快来尝鲜',
      url: 'https://nepenthe.melove.net',
      versionCode: 1,
      versionName: '0.0.1',
      force: false,
    }, {
      platform: 3,
      title: '功能尝鲜',
      desc: '新功能上线，快来尝鲜',
      url: 'https://nepenthe.melove.net',
      versionCode: 1,
      versionName: '0.0.1',
      force: false,
    }],
  };
  return {
    ...config,
    ...dataConfig,
  };
};
