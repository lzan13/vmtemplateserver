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

    ctx.logger.error('-lz- 收到授权回调');
    ctx.logger.error(ctx.params);

    const result = service.third.pay.authCallback(ctx.params);
    ctx.helper.success({ ctx, msg: '回调策略执行成功', data: result });
  }

  /**
   * 支付通知回调
   */
  async notifyCallback() {
    const { ctx, service } = this;

    ctx.logger.error(`-lz-headers- ${JSON.stringify(ctx.headers)}`);

    ctx.logger.error('-lz- 收到支付通知回调-1');
    ctx.logger.error(ctx.params);

    const params = ctx.params.permit(
      'gmt_create',
      'charset',
      'seller_email',
      'subject',
      'sign',
      'body',
      'buyer_id',
      'invoice_amount',
      'notify_id',
      'fund_bill_list',
      'notify_type',
      'trade_status',
      'receipt_amount',
      'app_id',
      'buyer_pay_amount',
      'sign_type',
      'seller_id',
      'gmt_payment',
      'notify_time',
      'version',
      'out_trade_no',
      'total_amount',
      'trade_no',
      'auth_app_id',
      'buyer_logon_id',
      'point_amount'
    );

    // 调用支付通知网关处理服务
    await service.third.pay.notifyCallback(JSON.parse(JSON.stringify(params)));

    ctx.helper.success({ ctx, msg: '支付通知回调执行成功' });
  }

}

module.exports = PayController;
