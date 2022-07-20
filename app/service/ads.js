/**
 * Create by lzan13 2022/06/09
 * 描述：广告处理服务
 */
'use strict';

const Service = require('egg').Service;

class AdsService extends Service {

  /**
   * 广告平台激励视频回调
   */
  async videoReward(params) {
    const { ctx, service } = this;

    const result = await this.checkSign(params);

    if (result) {
      // 计算充值金币数量
      const score = Number(params.rewardAmount) * 50;
      // 更新用户信息，更新用户金币数
      await service.user.update(params.userId, { $inc: { score } });

      // 用户观看视频任务奖励金币
      await service.score.create({ owner: params.userId, title: '视频任务奖励', count: score, type: 0, remarks: '用户观看视频任务奖励' });

      return true;
    }
    ctx.throw(422, '签名失败');
    return false;
  }

  /**
   * 验证签名
   * 'userId', 'rewardAmount', 'rewardName', 'time', 'sign'
   */
  async checkSign(params) {
    const { app, ctx } = this;

    // 防止恶意调用，这里对签名的时间戳加上判断，与服务器相差大于10秒则直接返回
    const currTime = Date.now();
    if (currTime - 1000 * 10 > Number(params.time)) {
      return false;
    }

    const signContent = 'userId=' + params.userId +
        '&rewardAmount=' + params.rewardAmount +
        '&rewardName=' + params.rewardName +
        '&time=' + params.time +
        '&secKey=' + app.config.ads.secKey;

    const sign = ctx.helper.cryptoMD5(signContent);
    return sign === params.sign;
  }
}

module.exports = AdsService;
