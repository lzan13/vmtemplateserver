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
    host: 'http://a31.easemob.com', // 环信 API 请求接口，在环信后台查看
    orgName: 'lzan13', // 环信 appKey # 前半段
    appName: 'vmtemplate', // 环信 appkey # 后半段
    clientId: 'YXA6TEfY3DHxRVSlzmvT-iDD4g', // 替换环信后台 clientId
    clientSecret: 'YXA6ZdcTLhNSXEVlaXJTtUWk4GOgF1o', // 替换环信后台 clientSecret
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
   * 支付相关配置
   */
  config.pay = {
    alipayAppId: 'APP Id', // alipay app Id
    alipayEncryptKey: 'AES 秘钥', // alipay AES 秘钥
    alipayPrivateKey: '私钥', // alipay 私钥
    alipayPublicKey: '公钥', // alipay 公钥
    alipayGateway: '网关', // alipay 网关
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
        pass: '邮箱密码', // 这个密码要根据邮箱后台确认是使用账户密码，还是客户端独有的密码
      },
    },
    from: 'VMLoft<notify@vmloft.com>', // from 表示邮件发送者，必须与认证账户相同
    activateSubject: '【社交系统】验证电子邮件地址',
    activateContent: '<div style="width:100%; background-color:#f6f7f8; margin: 0; padding: 0; font-family: Roboto-Regular,Helvetica,Arial,sans-serif; font-size: 14px;"><div style="width: 100%; height: 36px;"></div><div style="min-width: 360px; max-width: 600px; margin: 20px auto; background-color: #fff; box-shadow: 0px 5px 15px #f8f8f8"><div style="font-size: 22px; text-align:center; border-bottom: #eee 1px solid; margin: 0 16px"><div style="padding: 24px;">【虚拟阁楼】验证电子邮件地址</div></div><div style="width: 100%; text-align: left;  background-color: #ffffff;"><div style="min-width: 320px; max-width: 500px; margin: auto; color: #232323; line-height: 1.5; padding: 8px 0;"><div style="font-size: 18px; font-weight: bold; padding: 24px 16px;">尊敬的{0}您好！</div><div style="padding: 16px;">感谢您使用我们的服务，这里需要验证下您的电子邮件地址，点击下方的按钮以验证电子邮箱：</div><div style="padding: 8px 16px;"><a href="{1}/sign/activate?verify={2}">验证电子邮件地址</a></div><div style="padding: 16px;">如果您并没进行此类操作请忽略此邮件！</div><div style="color:#999999; padding: 24px 16px; text-align: end">虚拟阁楼团队</div></div></div><div style="margin:0 16px; padding: 16px; color: #999999; text-align:center; border-top: #eee 1px solid">©️2021虚拟阁楼.</div></div><div style="width: 100%; height: 36px;"></div></div>',
    codeSubject: '【社交系统】验证码',
    codeContent: '<div style="width:100%; background-color:#f6f7f8; margin: 0; padding: 0; font-family: Roboto-Regular,Helvetica,Arial,sans-serif; font-size: 14px;"><div style="width: 100%; height: 36px;"></div><div style="min-width: 360px; max-width: 600px; margin: 20px auto; background-color: #fff; box-shadow: 0px 5px 15px #f8f8f8"><div style="font-size: 22px; text-align:center; border-bottom: #eee 1px solid; margin: 0 16px"><div style="padding: 24px;">【虚拟阁楼】验证码</div></div><div style="width: 100%; text-align: left;  background-color: #ffffff;"><div style="min-width: 320px; max-width: 500px; margin: auto; color: #232323; line-height: 1.5; padding: 8px 0;"><div style="font-size: 18px; font-weight: bold; padding: 24px 16px;">尊敬的{0}您好！</div><div style="padding: 16px;">感谢您使用我们的服务，您正在进行敏感操作，下边是您请求的验证码</div><div style="padding: 8px 16px;"><strong style="color: #ff7138; font-size: 20px;font-weight: bold;">{1}</strong></div><div style="padding: 16px;">如果您并没进行此类操作请忽略此邮件！</div><div style="color:#999999; padding: 24px 16px; text-align: end">虚拟阁楼团队</div></div></div><div style="margin:0 16px; padding: 16px; color: #999999; text-align:center; border-top: #eee 1px solid">©️2021虚拟阁楼.</div></div><div style="width: 100%; height: 36px;"></div></div>',
  };

  /**
   * Mongoose 配置，服务器数据库需要验证
   */
  config.mongoose = {
    client: {
      // url: 'mongodb://127.0.0.1:27017/vmtemplate', // 未开启验证的链接方式
      url: 'mongodb://template:123456@118.190.25.131:27017/vmtemplate', // 开启验证的链接方式
      options: {
        bufferMaxEntries: 0,
        useFindAndModify: false,
        useUnifiedTopology: true,
      },
    },
  };

  // 用户配置
  const dataConfig = {
    // 部署服务地址
    host: 'http://localhost:5920',
    // 是否配置站点二级目录下，默认关闭，这个只有你需要配置二级站点时才开启
    subSite: false,
    // 启用二级站点后，二级站点目录路径，这里需要和你站点代理配置一致
    subSitePath: '/api',
    // 配置邮箱注册账户是否需要激活
    isNeedActivate: false,
  };
  return {
    ...config,
    ...dataConfig,
  };
};
