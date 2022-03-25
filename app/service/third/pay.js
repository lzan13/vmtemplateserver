/**
 * Create by lzan13 2021/8/9
 * 描述：支付处理服务
 */
'use strict';

const Service = require('egg').Service;

const AlipaySdk = require('alipay-sdk').default;
const AlipayFormData = require('alipay-sdk/lib/form').default;

class PayService extends Service {
  /**
   * 获取 alipay sdk 实例
   */
  alipaySDK() {
    const { app } = this;
    const alipaySDK = new AlipaySdk({
      /** 支付宝网关 **/
      gateway: app.config.pay.alipayGateway,

      /** 应用id，如何获取请参考：https://opensupport.alipay.com/support/helpcenter/190/201602493024 **/
      appId: app.config.pay.alipayAppId,

      /** 应用私钥，密钥格式为pkcs1，如何获取私钥请参考：https://opensupport.alipay.com/support/helpcenter/207/201602469554  **/
      privateKey: app.config.pay.alipayPrivateKey,

      /** 支付宝公钥，如何获取请参考：https://opensupport.alipay.com/support/helpcenter/207/201602487431 **/
      alipayPublicKey: app.config.pay.alipayPublicKey,

      /** 签名算法类型 **/
      signType: app.config.pay.signType,
    });
    return alipaySDK;
  }

  /**
   * 支付信息
   * @param order
   */
  async payInfo(order) {
    const { app } = this;

    const alipaySDK = this.alipaySDK();

    const formData = new AlipayFormData();

    /** 调用 setMethod 并传入 get，会返回可以跳转到支付页面的 url **/
    formData.setMethod('get');

    formData.addField('bizContent', {
      /** 商户订单号,商户自定义，需保证在商户端不重复，如：20200612000001 **/
      OutTradeNo: order.id,
      /** 销售产品码，固定值 QUICK_MSECURITY_PAY **/
      ProductCode: 'QUICK_MSECURITY_PAY',
      /** 订单标题 **/
      Subject: order.title,
      /** 订单金额，精确到小数点后两位 **/
      TotalAmount: order.realPrice,
      /** 订单描述 **/
      Body: order.remarks,
      // extendParams:{
      /** 系统商编号，填写服务商的PID用于获取返佣，返佣参数传值前提：传值账号需要签约返佣协议，用于isv商户。 **/
      // SysServiceProviderId: '2088****000',
      /** 花呗参数传值前提：必须有该接口花呗收款准入条件，且需签约花呗分期 **/
      /** 指定可选期数，只支持3/6/12期，还款期数越长手续费越高 **/
      // HbFqNum: '3',
      /** 指定手续费承担方式，手续费可以由用户全承担（该值为0），也可以商户全承担（该值为100），但不可以共同承担，即不可取0和100外的其他值。 **/
      // HbFqSellerPercent: '0',
      // },
    });

    /** 异步通知地址，商户外网可以post访问的异步地址，用于接收支付宝返回的支付结果，如果未收到该通知可参考该文档进行确认：https://opensupport.alipay.com/support/helpcenter/193/201602475759 **/
    formData.addField('notifyUrl', app.config.pay.notifyUrl);

    /** 第三方调用（服务商模式），传值app_auth_token后，会收款至授权token对应商家账号，如何获传值app_auth_token请参考文档：https://opensupport.alipay.com/support/helpcenter/79/201602494631 **/
    // formData.addField('appAuthToken', ' ');

    const result = await alipaySDK.exec('alipay.trade.app.pay', {}, { formData });
    /** 返回的url去除支付宝网关获取到orderString，可以直接给客户端请求。如果传值客户端失败，可根据返回错误信息到该文档寻找排查方案：https://opensupport.alipay.com/support/helpcenter/89 **/
    return result.replace(`${app.config.pay.signType}?`, '');

  }

  /**
   * 支付结果通知网关
   */
  async notifyCallback(params) {
    const { app, ctx, service } = this;

    // TODO 会员测试参数
    // params = {
    //   gmt_create: '2022-03-03 17:35:57',
    //   charset: 'utf-8',
    //   seller_email: 'cttgfs9041@sandbox.com',
    //   subject: '月度会员',
    //   sign: 'ZjI9PZo0uLxMG3Bz9U39em3QRaY4Vnq366tmSguGpZOBpHX+U70Zp+5787ZrZOlMTv9dKmvQAjy5m3Wb+CpWTSbmGhpq4+Ac3HC+qqQxIkBGj0yavqq6uvcRmOfM3dkndv8UcCKiU9Yhnoqk7huxuaaMVdeeswh8hqhUVbL3SzHvyXLxq4zVDHi2KC45IDhjPXbRFaRh5Xa7mFklJ962g2sWx9ftRa/15UuH5tEkadqO9UmpyBot8q2RlkGbhZ4Or/eLGbpk7ybLM6IFctZNB+qcc415J2AwOPt5fR93Fp1Gv1yKouMClnK/8qiO1+Tnlib4erfjTcxv8s4GmoBN4g==',
    //   body: '订单描述',
    //   buyer_id: '2088102170252992',
    //   invoice_amount: '8.88',
    //   notify_id: '2022030300222173558052990519816687',
    //   fund_bill_list: '[{"amount":"8.88","fundChannel":"ALIPAYACCOUNT"}]',
    //   notify_type: 'trade_status_sync',
    //   trade_status: 'TRADE_SUCCESS',
    //   receipt_amount: '8.88',
    //   app_id: '2016080100139523',
    //   buyer_pay_amount: '8.88',
    //   sign_type: 'RSA2',
    //   seller_id: '2088102169418963',
    //   gmt_payment: '2022-03-03 17:35:58',
    //   notify_time: '2022-03-03 17:35:59',
    //   version: '1.0',
    //   out_trade_no: '622089e00cbba7b00168bd12',
    //   total_amount: '8.88',
    //   trade_no: '2022030322001452990501891560',
    //   auth_app_id: '2016080100139523',
    //   buyer_logon_id: 'baq***@sandbox.com',
    //   point_amount: '0.00',
    // };

    // TODO 积分充值测试参数
    // params = {
    //   gmt_create: '2022-03-03 17:31:24',
    //   charset: 'utf-8',
    //   seller_email: 'cttgfs9041@sandbox.com',
    //   subject: '充值 200 忘忧币',
    //   sign: 'JPNv+VrjUiXWokAdQRmPSpl/5lBhX/nEHMVs7yvB2WXeGdDGTrQCfV064/kPUIiBCQSAdkcqyfl8W4O6P0SZWrZcuxkNGhH5647Mvd09qqI/RJJxaxGF0WzokHf7tGOhe1cyMPinCQ5I193IFGOekZR6c76g6iyJTwpqZVcpbxw+Sz4Blf5UBqgVF1Dt5X0K3t+Jc9fzO5VfM8/DIllu1piswHq9M/mXW2Sbx3TNEde+dBs9hVxYoFznXYlpr67/Oca+G6d0Q4fww5lmj/xCYWYRjFBNz50NYV7fEI6HJdpWa1VnZLae7uC6ZPZvr2Bjry9EbwqEpvkLXR0DZzFuqw==',
    //   body: '订单描述',
    //   buyer_id: '2088102170252992',
    //   invoice_amount: '1.00',
    //   notify_id: '2022030300222173125052990519815215',
    //   fund_bill_list: '[{"amount":"1.00","fundChannel":"ALIPAYACCOUNT"}]',
    //   notify_type: 'trade_status_sync',
    //   trade_status: 'TRADE_SUCCESS',
    //   receipt_amount: '1.00',
    //   app_id: '2016080100139523',
    //   buyer_pay_amount: '1.00',
    //   sign_type: 'RSA2',
    //   seller_id: '2088102169418963',
    //   gmt_payment: '2022-03-03 17:31:25',
    //   notify_time: '2022-03-03 17:31:26',
    //   version: '1.0',
    //   out_trade_no: '62208acc836cf2b0b56adc53',
    //   total_amount: '1.00',
    //   trade_no: '2022030322001452990501891633',
    //   auth_app_id: '2016080100139523',
    //   buyer_logon_id: 'baq***@sandbox.com',
    //   point_amount: '0.00',
    // };

    const alipay = this.alipaySDK();
    // 进行验签
    const result = alipay.checkNotifySign(params);
    let status = 1;
    let extend = '支付完成';
    const orderId = params.out_trade_no;
    if (result) {
      if (app.config.pay.alipayAppId === params.app_id) {
        // 验签通过，检查其他字段
        const order = await service.order.find(orderId);
        if (!order) {
          status = 3;
          extend = `订单不存在 ${params.out_trade_no}`;
        } else {
          if (order.realPrice !== params.total_amount) {
            status = 3;
            extend = `订单金额错误 ${params.total_amount}`;
          } else {
            // 真实支付成功了，这里做一些处理
            this.updateUserInfo(order);
          }
        }
      } else {
        status = 3;
        extend = `支付 id 不匹配 ${params.app_id}`;
      }
    } else {
      // 验签失败
      status = 3;
      extend = '订单签名验证失败';
    }
    ctx.logger.error(`支付结果 ${status} ${extend}`);

    service.order.findByIdAndUpdate(orderId, { status, extend });
  }

  /**
   * 支付系统授权回调
   */
  async authCallback(params) {
    console.log(params);
  }

  /**
   * 根据订单信息更新用户信息
   */
  async updateUserInfo(order) {
    const commodity = order.commoditys[0];

    // 商品类型
    if (commodity.type === 0) {
      this.updateUserScore(order.owner, commodity);
    } else if (commodity.type === 1) {
      this.updateUserRole(order.owner, commodity);
    }
  }

  /**
   * 更新用户金币数
   */
  async updateUserScore(owner, commodity) {
    const { service } = this;
    // 计算充值金币数量
    const score = Number(commodity.price) * 100;
    // 更新用户信息
    service.user.update(owner, { $inc: { score } });
  }

  /**
   * 更新用户角色信息
   */
  async updateUserRole(owner, commodity) {
    const { service } = this;
    // 计算会员到期时间
    let time = 0;
    if (commodity.level === 1) {
      time = 30 * 24 * 60 * 60 * 1000;
    } else if (commodity.level === 3) {
      time = 3 * 30 * 24 * 60 * 60 * 1000;
    } else if (commodity.level === 12) {
      time = 12 * 30 * 24 * 60 * 60 * 1000;
    } else {
      time = 30 * 24 * 60 * 60 * 1000;
    }
    const user = await service.user.find(owner);
    // 角色过期时间戳
    let roleTime;
    if (user.roleDate && user.roleDate > Date.now()) {
      roleTime = new Date(new Date(user.roleDate)).getTime() + 24 * 60 * 60 * 1000 - 1 + time;// 当天23:59
    } else {
      roleTime = new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1 + time;// 当天23:59
    }
    // 过期日期
    const roleDate = new Date(roleTime);
    // 获取会员角色信息
    const role = await service.role.findByIdentity(100);
    // 更新用户信息
    await service.user.update(owner, { role: role.id, roleDate });
  }

}

module.exports = PayService;
