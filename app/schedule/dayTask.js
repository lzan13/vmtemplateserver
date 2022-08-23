/**
 * Create by lzan13 2020/7/6
 * 描述：每日检查的定时任务，这里定义为每天凌晨 1 点执行
 */
'use strict';

const Subscription = require('egg').Subscription;

class DaySubscription extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      // cronOptions: 1, // 配置 cron 的时区等，参见 cron-parser 文档
      disable: false, // 是否启用定时任务
      immediate: false, // 配置了该参数为 true 时，这个定时任务会在应用启动并 ready 后立刻执行一次这个定时任务。
      // interval: '10s', // 指定时间间隔执行
      cron: '30 30 3 * * *', // 指定时间点执行，这是设置每天凌晨03:30
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
  // 将到期的会员身份设置为普通成员
  console.log('-lz- update start ' + Date.now());
  const role = await ctx.service.role.findByIdentity(9);
  const result = await ctx.model.User.updateMany({ roleTime: { $lte: Date.now() } }, { role: role.id, roleTime: 0 });
  console.log('-lz- update stop ' + Date.now());
  ctx.logger.info('定时任务执行结果' + JSON.stringify(result));
}

module.exports = DaySubscription;
