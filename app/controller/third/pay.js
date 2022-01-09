/**
 * Create by lzan13 2020/7/6
 * 描述：支付相关控制类
 */
'use strict';

const Controller = require('egg').Controller;

class PayController extends Controller {

  /**
   * 授权回调接口
   */
  async authCallback() {
    const { ctx, service } = this;
    const result = service.third.pay.authCallback();
    ctx.helper.success({ ctx, msg: '回调策略执行成功', data: result });
  }
  /**
   * 支付通知网关
   */
  async gateway() {
    const { ctx, service } = this;

    ctx.logger.error(`-lz-headers- ${JSON.stringify(ctx.headers)}`);
    // ctx.throw(403, '无权调用');
    const params = ctx.params;

    // 调用支付通知网关处理服务
    const result = await service.third.pay.gateway(params);

    ctx.helper.success({ ctx, msg: '支付通知网关执行成功', data: result });
  }

}

module.exports = PayController;
