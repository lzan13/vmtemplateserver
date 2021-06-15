/**
 * Create by lzan13 2020/7/7
 * 描述：签到信息处理服务
 */
'use strict';

const Service = require('egg').Service;

class ClockService extends Service {

  /**
   * 创建一条新纪录
   * @param params
   */
  async create(userId) {
    const { ctx } = this;
    // 查询今天是否已经打卡
    const todayClock = await ctx.service.clock.findToday(userId);
    if (todayClock.length > 0) {
      ctx.throw(409, '今天已签到');
    }
    // 判断昨天是否打卡
    const yesterdayClock = await ctx.service.clock.findYesterday(userId);
    let update = {};
    if (yesterdayClock.length > 0) {
      // 连续签到积分 +10
      update = { $inc: { clockContinuousCount: 1, clockTotalCount: 1, score: 10 }, clockTime: Date.now() };
    } else {
      // 单次签到积分 +5
      update = { $inc: { clockTotalCount: 1, score: 5 }, clockContinuousCount: 1, clockTime: Date.now() };
    }
    // 更新打卡天数，总数与连续天数都更新
    await ctx.model.User.findByIdAndUpdate(userId, update);

    return ctx.model.Clock.create({ userId });
  }

  /**
   * 删除一条记录
   * @param id
   */
  async destroy(id) {
    const { ctx, service } = this;
    const clock = await service.clock.find(id);
    if (!clock) {
      ctx.throw(404, `记录不存在 ${id}`);
    }
    return ctx.model.Clock.findByIdAndRemove(id);
  }

  /**
   * 获取列表，可根据参数判断是否分页，搜索
   * @param params 查询参数
   */
  async index(params) {
    const { ctx } = this;
    const { userId, page, limit } = params;
    let result = [];
    let currentCount = 0;
    let totalCount = 0;
    // 计算分页
    const skip = Number(page) * Number(limit || 20);
    // 组装查询参数
    const query = {};
    if (userId) {
      query.userId = userId;
    }

    result = await ctx.model.Clock.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .exec();
    currentCount = result.length;
    totalCount = await ctx.model.Clock.count(query).exec();

    // 整理数据源 -> Ant Design Pro
    const data = result.map(item => {
      const json = Object.assign({}, item._doc);
      return json;
    });

    return { currentCount, totalCount, page: Number(page), limit: Number(limit), data };
  }


  /**
   * ===================================================================================
   * 通用方法，主要是这些方法有多个地方调用，简单封装下
   */
  /**
   * 查找今天打卡记录
   * @param userId
   */
  async findToday(userId) {
    const startTime = new Date(new Date(new Date().toLocaleDateString()).getTime()); // 当天0点
    const endTime = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);// 当天23:59
    return this.ctx.model.Clock.find({ userId, createdAt: { $gte: startTime, $lte: endTime } });
  }
  /**
   * 查找昨天打卡记录
   * @param userId
   */
  async findYesterday(userId) {
    const startTime = new Date(new Date(new Date().toLocaleDateString()).getTime() - 24 * 60 * 60 * 1000); // 昨天0点
    const endTime = new Date(new Date(new Date().toLocaleDateString()).getTime() - 1);// 昨天23:59
    return this.ctx.model.Clock.find({ userId, createdAt: { $gte: startTime, $lte: endTime } });
  }
}

module.exports = ClockService;
