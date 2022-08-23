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
      // cronOptions: 1, // 配置 cron 的时区等，参见 cron-parser 文档
      disable: false, // 是否启用定时任务
      immediate: false, // 配置了该参数为 true 时，这个定时任务会在应用启动并 ready 后立刻执行一次这个定时任务。
      // interval: '10s', // 指定时间间隔执行
      cron: '30 30 3 * * 1', // 指定时间点执行，这是设置每周一凌晨03:30
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
async function resetUserAttr(ctx) {
  // 每周一初清零周度魅力值
  console.log('-lz- update start ' + Date.now());
  const result = await ctx.model.User.updateMany({ charmWeek: { $gt: 0 } }, { charmWeek: 0 });
  console.log('-lz- update stop ' + Date.now());
  ctx.logger.info('定时任务执行结果' + JSON.stringify(result));
}


module.exports = WeekSubscription;
