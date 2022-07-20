/**
 * Create by lzan13 2020/7/6
 * 描述：每周检查的定时任务，这里定义为每周一凌晨1点执行
 */
'use strict';

const Subscription = require('egg').Subscription;

class WeekSubscription extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      // interval: '8h', // 指定时间间隔执行
      cron: '10 10 1 * * 1', // 指定时间点执行
      type: 'worker', // 指定所有的 worker 都需要执行
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    resetUserAttr(this.ctx);
  }
}

/**
 * 重置需要每天恢复的用户属性
 */
function resetUserAttr(ctx) {
  ctx.logger.info('重置用户属性');


}


module.exports = WeekSubscription;
