/**
 * Create by lzan13 2020/7/6
 * 描述：广告相关控制类
 */
'use strict';

const Controller = require('egg').Controller;

class AdsController extends Controller {

  /**
   * 视频激励回调
   */
  async videoReward() {
    const { ctx, service } = this;
    const params = ctx.params.permit('userId', 'rewardAmount', 'rewardName', 'time', 'sign');
    const result = await service.ads.videoReward(params);
    ctx.helper.success({ ctx, msg: '奖励更新成功', data: result });
  }
}

module.exports = AdsController;
