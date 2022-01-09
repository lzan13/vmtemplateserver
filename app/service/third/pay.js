/**
 * Create by lzan13 2021/8/9
 * 描述：支付处理服务
 */
'use strict';

const Service = require('egg').Service;
// const AlipaySdk = require('alipay-sdk').default;

class PayService extends Service {
  /**
   * 沙箱ID: 2016080100139523
   *
   */
  /**
   * 统一进行请求
   * @param url api 地址
   * @param method 请求方式 GET POST DELETE PUT
   * @param customHeaders 自定义请求头
   * @param data 请求参数
   */
  async apiRequest(url, method, customHeaders, data) {
    const headers = {
      'Content-Type': 'application/json',
    };
    Object.assign(headers, customHeaders);
    return await this.ctx.curl(url, {
      method,
      headers,
      data,
      dataType: 'json',
    });
  }

  async alipay() {
    // const { app, ctx } = this;
    // const alipay = new AlipaySdk({
    //   appId: app.config.pay.alipayAppId,
    //   privateKey: app.config.pay.alipayPrivateKey,
    //   alipayPublicKey: app.config.pay.alipayPublicKey,
    //   encryptKey: app.config.pay.alipayEncryptKey,
    //   gateway: app.config.pay.alipayGateway,
    //   signType: 'RSA2',
    // });

    // alipaySdk.exec('alipay.system.oauth.token', {
    //   grantType: 'authorization_code',
    //   code: 'code',
    //   refreshToken: 'token',
    // }).then(result => {
    //   })
    //   .catch(err){
    // }
  }

  /**
   * 支付结果网关
   */
  async gateway() {
    const { ctx } = this;
    ctx.logger.error('-lz- 收到网关回调请求');
    ctx.logger.error(ctx.params);
  }

  /**
   * 支付系统授权回调
   */
  async authCallback() {
    const { ctx } = this;
    ctx.logger.error('-lz- 收到授权回调请求');
    ctx.logger.error(ctx.params);

  }

}

module.exports = PayService;
