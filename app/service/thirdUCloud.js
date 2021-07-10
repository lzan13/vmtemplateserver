/**
 * Create by lzan13 2021/7/2
 * 描述：验证码信息处理服务
 */
'use strict';

const Service = require('egg').Service;

class ThirdUCloudService extends Service {

  /**
   * UCloud 上传回调
   */
  async callbackObj(params) {
    return this.service.attachment.create(params);
  }

  /**
   * UCloud 对象操作签名
   */
  async signatureObj(params) {
    const { app, ctx } = this;
    /**
     * {
     *    "method": "PUT",
     *    "bucket": "vmmatch",
     *    "key": "20210707_163950707",
     *    "content_type": "image/*",
     *    "content_md5": "ccbc1d54257d3c061dbdb63e0916bec5",
     *    "date": "20210707163950"
     * }
     */
    console.log(params);
    const content = `${params.method}\n${params.content_md5}\n${params.content_type}\n${params.date}\n/${params.bucket}/${params.key}`;
    const signature = ctx.helper.cryptoSignature(content, app.config.ucloud.privateKey);
    return `UCloud ${app.config.ucloud.publicKey}:${signature}`;
  }


}

module.exports = ThirdUCloudService;
