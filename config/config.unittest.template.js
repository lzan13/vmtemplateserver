/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * 单元测试配置
 */
module.exports = () => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   */
  const config = {};

  /**
   * Easemob IM 配置 https://console.easemob.com/app/im-service/detail
   */
  config.easemob = {
    enable: false, // 是否启用环信 IM
    host: 'http://a1.easemob.com', // 环信 API 请求接口，在环信后台查看
    orgName: 'orgName', // 环信 appKey # 前半段
    appName: 'appName', // 环信 appkey # 后半段
    clientId: 'client id', // 替换环信后台 clientId
    clientSecret: 'client secret', // 替换环信后台 clientSecret
  };

  /**
   * 邮箱配置
   */
  config.mail = {
    config: {
      host: 'smtp.exmail.qq.com', // 主机地址
      port: 465,
      secure: true,
      auth: {
        user: 'notify@vmloft.com',
        pass: 'pc8fks3F7hESTGhG', // 这个密码要根据邮箱后台确认是使用账户密码，还是客户端独有的密码
      },
    },
    from: 'VMLoft<notify@vmloft.com>', // from 表示邮件发送者，必须与认证账户相同
    activateSubject: '【社交项目】验证电子邮件地址',
    activateContent: '<div style="width:100%; background-color:#f6f7f8; margin: 0; padding: 0; font-family: Roboto-Regular,Helvetica,Arial,sans-serif; font-size: 14px;"><div style="width: 100%; height: 36px;"></div><div style="min-width: 360px; max-width: 600px; margin: 20px auto; background-color: #fff; box-shadow: 0px 5px 15px #f8f8f8"><div style="font-size: 22px; text-align:center; border-bottom: #eee 1px solid; margin: 0 16px"><div style="padding: 24px;">【社交项目】验证电子邮件地址</div></div><div style="width: 100%; text-align: left;  background-color: #ffffff;"><div style="min-width: 320px; max-width: 500px; margin: auto; color: #232323; line-height: 1.5; padding: 8px 0;"><div style="font-size: 18px; font-weight: bold; padding: 24px 16px;">尊敬的{0}您好！</div><div style="padding: 16px;">感谢您使用我们的服务，这里需要验证下您的电子邮件地址，点击下方的按钮以验证电子邮箱：</div><div style="padding: 8px 16px;"><a href="{1}/sign/activate?verify={2}">验证电子邮件地址</a></div><div style="padding: 16px;">如果您并没进行此类操作请忽略此邮件！</div><div style="color:#999999; padding: 24px 16px; text-align: end">社交项目团队</div></div></div><div style="margin:0 16px; padding: 16px; color: #999999; text-align:center; border-top: #eee 1px solid">©️2021社交项目.</div></div><div style="width: 100%; height: 36px;"></div></div>',
    codeSubject: '【社交项目】验证码',
    codeContent: '<div style="width:100%; background-color:#f6f7f8; margin: 0; padding: 0; font-family: Roboto-Regular,Helvetica,Arial,sans-serif; font-size: 14px;"><div style="width: 100%; height: 36px;"></div><div style="min-width: 360px; max-width: 600px; margin: 20px auto; background-color: #fff; box-shadow: 0px 5px 15px #f8f8f8"><div style="font-size: 22px; text-align:center; border-bottom: #eee 1px solid; margin: 0 16px"><div style="padding: 24px;">【社交项目】验证码</div></div><div style="width: 100%; text-align: left;  background-color: #ffffff;"><div style="min-width: 320px; max-width: 500px; margin: auto; color: #232323; line-height: 1.5; padding: 8px 0;"><div style="font-size: 18px; font-weight: bold; padding: 24px 16px;">尊敬的{0}您好！</div><div style="padding: 16px;">感谢您使用我们的服务，您正在进行敏感操作，下边是您请求的验证码</div><div style="padding: 8px 16px;"><strong style="color: #ff7138; font-size: 20px;font-weight: bold;">{1}</strong></div><div style="padding: 16px;">如果您并没进行此类操作请忽略此邮件！</div><div style="color:#999999; padding: 24px 16px; text-align: end">社交项目团队</div></div></div><div style="margin:0 16px; padding: 16px; color: #999999; text-align:center; border-top: #eee 1px solid">©️2021社交项目.</div></div><div style="width: 100%; height: 36px;"></div></div>',
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

  /**
   * 数据配置
   */
  const dataConfig = {
    // 部署服务地址，正式发布时需要改成你的域名地址
    host: 'http://localhost:5920',
    // 是否配置站点二级目录下，默认关闭，这个只有你需要配置二级站点时才开启
    subSite: false,
    // 启用二级站点后，二级站点目录路径，这里需要和你站点代理配置一致
    subSitePath: '/api',
    // 配置邮箱注册账户是否需要激活
    isNeedActivate: false,
    userList: [
      { // 超管账户
        email: 'admin@vmloft.com',
        username: 'admin',
        password: '123123',
        devicesId: 'f64efecaac6d5980',
        identity: 1000,
      }, { // 管理后台内容监督账户
        email: 'police@vmloft.com',
        username: 'police',
        password: 'policev5123',
        devicesId: 'f64efecaac6d5981',
        identity: 600,
      }, { // 管理后台测试账户
        email: 'visitor@vmloft.com',
        username: 'visitor',
        password: 'visitor123',
        devicesId: 'f64efecaac6d5982',
        identity: 600,
      }, { // 上线审核测试账户1
        email: 'test01@vmloft.com',
        username: 'test01',
        password: '123123',
        devicesId: 'f64efecaac6d5983',
        identity: 8,
      }, { // 上线审核测试账户2
        email: 'test02@vmloft.com',
        username: 'test02',
        password: '123123',
        devicesId: 'f64efecaac6d5984',
        identity: 8,
      },
    ],
    siteList: [{ // 系统配置信息
      alias: 'nepenthe',
      title: '社交项目服务系统',
      desc: '社交项目服务数据管理系统，包含完整的社交逻辑处理',
      content: '',
    }, {
      alias: 'agreement',
      title: '用户协议',
      desc: '用户协议配置信息，这里可以配置隐私政策地址，也可以配置 html 内容',
      content: 'https://template.com/#/agreement',
    }, {
      alias: 'policy',
      title: '隐私政策',
      desc: '隐私政策配置信息，这里可以配置隐私政策地址，也可以配置 html 内容',
      content: 'https://template.com/#/policy',
    }, {
      alias: 'norm',
      title: '用户行为规范',
      desc: '用户行为规范配置信息，这里可以配置隐私政策地址，也可以配置 html 内容',
      content: 'https://template.com/#/norm',
    }, {
      alias: 'appConfig',
      title: '客户端配置信息',
      desc: '客户端所需配置信息，Json 格式，方便灵活配置',
      content: '{"adsConfig":{"splashEntry":false,"exploreEntry":true,"goldEntry":true},"chatConfig":{"chatEntry":true,"voiceEntry":false,"pictureEntry":false,"callEntry":true,"giftEntry":true,"voiceLimit":2,"pictureLimit":2,"callLimit":5},"homeConfig":{"randomEntry":true,"chatFastEntry":true,"gameEntry":true,"roomEntry":false},"tradeConfig":{"scoreEntry":true,"tradeEntry":true,"vipEntry":true},"sensitiveWords":["测试"]}',
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
      price: 1000,
      currPrice: 888,
      inventory: '999999',
      status: 1,
      type: 1,
      level: 1,
      remarks: '订阅会员服务',
    }, { // 金币充值商品
      title: '充值 200 忘忧币',
      desc: '首冲体验',
      price: 100,
      currPrice: 100,
      inventory: '999999',
      status: 1,
      type: 0,
      remarks: '账户余额充值',
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
      title: '审查员',
      desc: '负责站点输出内容审核',
      identity: 700,
    }, {
      title: '监管员',
      desc: '系统内容安全监管',
      identity: 600,
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
      url: 'https://template.com/download',
      versionCode: 1,
      versionName: '0.0.1',
      force: false,
    }, {
      platform: 1,
      title: '功能尝鲜',
      desc: '新功能上线，快来尝鲜',
      url: 'https://template.com/download',
      versionCode: 1,
      versionName: '0.0.1',
      force: false,
    }, {
      platform: 2,
      title: '功能尝鲜',
      desc: '新功能上线，快来尝鲜',
      url: 'https://template.com/download',
      versionCode: 1,
      versionName: '0.0.1',
      force: false,
    }, {
      platform: 3,
      title: '功能尝鲜',
      desc: '新功能上线，快来尝鲜',
      url: 'https://template.com/download',
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
