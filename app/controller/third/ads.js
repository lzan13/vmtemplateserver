/**
 * Create by lzan13 2020/7/6
 * 描述：广告相关控制类
 */
'use strict';

const Controller = require('egg').Controller;

class AdsController extends Controller {

  /**
   * 激励视频回调接口
   * https://nepenthe.melove.net/api/v1/third/ads/rewardCallback?app_env=overseas&platform=admob&user_id={user_id}&trans_id={trans_id}&reward_amount={reward_amount}&reward_name={reward_name}&sign={sign}&unit_id={unit_id}
   * mintegral 回调 url
   * https://nepenthe.melove.net/api/v1/third/ads/rewardCallback?app_env=overseas&platform=mintegral&user_id={user_id}&trans_id={trans_id}&reward_amount={reward_amount}&reward_name={reward_name}&sign={sign}&unit_id={unit_id}
   * TopOn 回调 url
   * https://nepenthe.melove.net/api/v1/third/ads/rewardCallback?app_env=china&platform=topon&user_id={user_id}&trans_id={trans_id}&reward_amount={reward_amount}&reward_name={reward_name}&placement_id={placement_id}&extra_data={extra_data}&network_firm_id={network_firm_id}&adsource_id={adsource_id}&scenario_id={scenario_id}&sign={sign}&ilrd={ilrd}
   * user_id  用户ID  由开发者通过TopOn SDK API设置
   * extra_data  用户业务参数  由开发者通过TopOn SDK API设置
   * trans_id  TopOn服务端生成的trans_id，具有唯一性  强烈建议开发者在服务器发放激励前校验trans_id是否已发放激励，以规避对相同的trans_id重复发放激励
   * reward_name  激励名称  在开发者后台设置(支持广告位或广告场景设置）
   * reward_amount  激励数量  在开发者后台设置 (支持广告位或广告场景设置）
   * placement_id  TopOn广告位ID  -
   * network_firm_id  TopOn聚合的广告平台ID  查看TopOn广告平台ID列表
   * adsource_id  TopOn广告源ID  -
   * scenario_id  TopOn广告场景ID  由开发者通过TopOn SDK API设置
   * sign  签名信息  参考签名规则说明
   * ilrd  TopOn SDK回调的展示级别数据. 数据为json字符串  TopOn SDK v5.7.78及以上版本支持。TopOn SDK在回调激励视频OnReward时给开发者提供展示级别的数据，具体数据格式参考
   */
  async rewardCallback() {
    const { ctx, service } = this;
    ctx.logger.error('-lz- 收到激励视频回调 - ');
    ctx.logger.error(ctx.params);
    const params = ctx.params.permit(
      'app_env',
      'platform',
      'user_id',
      'trans_id',
      'reward_amount',
      'reward_name',
      'placement_id',
      'adsource_id',
      'sign',
      'unit_id',
      'ilrd'
    );

    const result = await service.third.ads.rewardCallback(params);
    if (result) {
      ctx.helper.success({ ctx, msg: '回调策略执行成功', data: result });
    } else {
      ctx.helper.error({ ctx, code: 601, msg: '回调策略执行失败', data: result });
    }
  }
}

module.exports = AdsController;
