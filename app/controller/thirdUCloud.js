/**
 * Create by lzan13 2020/7/6
 * 描述：签名相关控制类，主要是一些三方服务为了安全需要在服务器端进行签名认证
 */
'use strict';

const Controller = require('egg').Controller;

class ThirdUCloudController extends Controller {


  /**
   * UCloud 对象操作签名
   */
  async callbackObj() {
    const { ctx, service } = this;
    /**
     * {
     *    "extname": ".jpg",
     *    "filename": "123.jpg",
     *    "path": "http://data.match.melove.net/123.jpg",
     *    "extra": "image/*",
     * }
     */
    const params = ctx.params;

    const result = await service.thirdUCloud.callbackObj(params);

    ctx.helper.success({ ctx, msg: '回调策略执行成功', data: result });
  }
  /**
   * UCloud 对象操作签名
   */
  async signatureObj() {
    const { ctx, service } = this;
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
    const params = ctx.params;

    const result = await service.thirdUCloud.signatureObj(params);

    ctx.body = result;
  }

}

module.exports = ThirdUCloudController;
