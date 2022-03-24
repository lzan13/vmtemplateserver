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
      gateway: 'https://openapi.alipaydev.com/gateway.do',

      /** 应用id，如何获取请参考：https://opensupport.alipay.com/support/helpcenter/190/201602493024 **/
      appId: app.config.pay.alipayAppId,

      /** 应用私钥，密钥格式为pkcs1，如何获取私钥请参考：https://opensupport.alipay.com/support/helpcenter/207/201602469554  **/
      privateKey: 'MIIEpAIBAAKCAQEAqBgtTfjg1wG/6nOSuddqlWomxLQ8TZ6T/6M3EM6zHJjiqhk537cj69GAfaDEpROkrBFGZaOjObLOo+dJXUtBHCwlLhQ1u3iMxQWLWLzxO8BE6N8kEtzx3m3vxA8RRov6n1y5GrfpXDqYfoxPjO03ykFt94sF6TUphhOa5/JzPIEQaYwpksAa2TD6GmZC4/xtWdvQ7eMxDgzQtimOrZpRUQ3/dQDQIUBbCZi1owUGLXZLsYyY1ydGZFp/ZNghDzZYXpVqeC/3AhYJfwNv89dCoMEZOeD5bbK/0TAxQ64BSOTdjBMEnDte1//QahbTn1J75BulC6iGKg2YJZ36NRriiQIDAQABAoIBAE9gE0ylgG6nCdwJNTkCivcBSEtMnMk+X76wcNlD8fpIC4itHtIQZir+JAGuwAz/iJwkEC0Ap5wgXkmxdshSN+24vtnSe0kKdNa4doOxvOwtL50TebJamPAi07yuLMc2ZGOKYnJGdDC0Drx7PzlZ7yVX3jitcl4cV35Tlat/poDj3pCG6TZAVYC8uyJPE48TZr+emoKyFj2H2h4fy/8uUB3uxOoT6HX+EQJJMBjElKPqUH1cSDs/Azk2UOsU9MeOTAZB6OF0gvxCktzC6BjTfne8lRrqNyiUKGUdvnRqUcA+blVKS02PmvQpIgGM9YeGWYFSqnkRH0+9qoULozNQ3HECgYEA9V5RwUqos7I3b6xXiHtrpbpV/3eB32YCxJIu4yGXr0k35ikhXn760qwxRld3EXf/yVknQcorGgVZgC9z0J3uIqvQ7KpzUGgpETzeTdZw5qLfpAGCG8gpecQayeTEjubRxQGddqTxelYQjB2MNxMYWacpFMikhmLv53Pw/MKTrNUCgYEAr2C3rPCIqwRP8exUvsZhh8cvX2DAbNE1kgbDL/oT5QI2UGpVIuqXViZPPEGIATqWgs+suWtgj5pHL316FnuyNpqJ7mshA4qZ1UOgsCi8dDxTwZwjlijwB/2hRhk+yBH7SJ8JBsyfETiEoN4blu1LTn0jb/pBssocVvWjjsQAKOUCgYEA2ZaTv2o6omfnOzPEx/ZS5ruQKaTL2dT3nWPZCngusDWoyYUt30ORoCMs6ykDIM2eWeqionfqsv+Nd9wcwyJaHArrkgQxkFteF7g3lyUUJ6LF2gWwYHynMyERdHpXSDYuTZr6DU2GCquprudBAVIApPhUuOaY58dy4Xhye2L9XCUCgYBJ97fgN97cikgRmASyJceS1b60MoFWI/K9MR73yDjF2OYBiqd3v4uuqR+4IUd0hTpf16lY1uH2DzLA4+IvQ2KJxyovpX1aGgYBvbEzOysotxz4Rpt3xLJgHGf9wb4J8hOSsIjFFl5si/LcSnFGebTOWNcublVxS+8h+h5Oo3oRxQKBgQCxc9rp6WnyZnslKgYfZvL0Ryu69dBQizyHH8wQPXosqZcGvmX5YHMUC2lPG+BXFafbj7qfCFaWjvX3q/GxdCaeTlXLBqQJ09v7769zlBKVVd6gGXHpTjm3xh7zQpPUy72rTVzcVghLO3u5q6KPAWiT1nMTIOjSUEVxTHFVtEypqw==',

      /** 支付宝公钥，如何获取请参考：https://opensupport.alipay.com/support/helpcenter/207/201602487431 **/
      alipayPublicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAjds3JSzgu+ksokQrRIL+W5o0UAsBDGyCUTTxQBt+kGkiugcX4XLmwBQMsJvJt6OBgNTIIBUJ88GGmti122SQGF9Kb9j5XEn2kxg+MrhP5zNs6FSX95aHKNxgyxTymi4tnWWbin62KJwp/9loqmomqOdhuwS4BiWtUhnwZw2rAjKEaIfYiLb728iGZDLUcfEkzl1wNV3kSPVUWlzORT4zODiM2fwz9zv6ojGsC/ykunV0Zmh+PCU5D8pp2lxfZufSzeBtKfpKsN1GRhB7E6rzCNnpzGsaijTmC05Om/2v+0ipcSZuFOpY6mU0Zck7GNwxFFkU8WGG7yTLGX2VUgnR6wIDAQAB',

      /** 签名算法类型 **/
      signType: 'RSA2',
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
      Body: '订单描述',
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
    return result.replace('https://openapi.alipaydev.com/gateway.do?', '');

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
