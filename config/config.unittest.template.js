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
    host: 'http://a1.easemob.com', // 环信 API 请求接口，在环信后台查看
    orgName: 'orgName', // 环信 appKey # 前半段
    appName: 'appName', // 环信 appkey # 后半段
    clientId: 'client id', // 替换环信后台 clientId
    clientSecret: 'client secret', // 替换环信后台 clientSecret
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

  return {
    ...config,
  };
};
