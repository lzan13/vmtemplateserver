/**
 * Create by lzan13 2021/8/9
 * 描述：支付处理服务
 */
'use strict';

const Service = require('egg').Service;

class AdsService extends Service {

  /**
   * 广告平台激励视频回调
   */
  async rewardCallback(params) {
    const { service } = this;

    const result = await this.checkSign(params);

    if (result) {
      // 计算充值金币数量
      const score = Number(params.reward_amount) * 50;
      // 更新用户信息，更新用户金币数
      await service.user.update(params.user_id, { $inc: { score } });
      return true;
    }
    return false;
  }

  /**
   * 验证签名
   * 'app_env',
   * 'platform',
   * 'user_id',
   * 'trans_id',
   * 'reward_amount',
   * 'reward_name',
   * 'placement_id',
   * 'adsource_id',
   * 'sign',
   * 'unit_id',
   * 'ilrd'
   */
  async checkSign(params) {
    const { app, ctx } = this;

    // params = {
    //   app_env: 'china',
    //   platform: 'mintegral',
    //   user_id: '623c775e6783c24c3a96b81f',
    //   trans_id: '3a1205da290343ae184bfb6fa8ab1bf8_1697103_1650959761300',
    //   reward_amount: '1',
    //   reward_name: 'reward',
    //   placement_id: 'b62583b7c12bdb',
    //   adsource_id: '1697103',
    //   sign: 'e0e32865a2d5977985a09cdfe102748f',
    //   ilrd: '{"id":"3a1205da290343ae184bfb6fa8ab1bf8_1697103_1650959761300","publisher_revenue":0.005,"currency":"CNY","country":"CN","adunit_id":"b62583b7c12bdb","adunit_format":"RewardedVideo","precision":"estimated","network_type":"Network","network_placement_id":"f01967e51c1","ecpm_level":1,"segment_id":0,"scenario_reward_name":"reward_item","scenario_reward_number":1,"network_firm_id":29,"adsource_id":"1697103","adsource_index":0,"adsource_price":5,"adsource_isheaderbidding":0,"reward_custom_data":"userData"}',
    // };

    let signContent = '';
    if (params.platform === 'admob') {
      // Admob
    } else if (params.platform === 'mintegral') {
      // Mintegral MD5 内容拼接方式 user_id_reward_amount_trans_id_security_key
      signContent = params.user_id + '_' + params.reward_amount + '_' + params.trans_id + '_' +
        (params.app_env === 'china' ? app.config.ads.mintegralSecKeyCN : app.config.ads.mintegralSecKey);
    } else {
      signContent = 'trans_id=' + params.trans_id +
        '&placement_id=' + params.placement_id +
        '&adsource_id=' + params.adsource_id +
        '&reward_amount=' + params.reward_amount +
        '&reward_name=' + params.reward_name +
        '&sec_key=' + (params.app_env === 'china' ? app.config.ads.secKeyCN : app.config.ads.secKey);
    }

    if (params.ilrd) {
      signContent += `&ilrd=${params.ilrd}`;
    }
    const sign = ctx.helper.cryptoMD5(signContent);
    return sign === params.sign;
  }
}

module.exports = AdsService;
