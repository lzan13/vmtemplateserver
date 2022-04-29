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
  async create() {
    const { ctx } = this;
    // 查询今天是否已经打卡
    const userId = ctx.state.user.id;
    const todayCount = await ctx.service.clock.findTodayCount(userId);
    if (todayCount > 0) {
      ctx.throw(409, '今天已签到');
    }
    // 判断昨天是否打卡
    const yesterdayCount = await ctx.service.clock.findYesterdayCount(userId);
    let update = {};
    let score = 5;
    if (yesterdayCount > 0) {
      const user = await this.ctx.model.User.findById(userId, { clockContinuousCount: 1 });
      if (user.clockContinuousCount < 20) {
        score = (user.clockContinuousCount + 1) * 5;
      } else {
        score = 100;
      }
      // 连续签到积分 +20 同时恢复私聊和匹配次数
      update = {
        $inc: { clockContinuousCount: 1, clockTotalCount: 1, score },
        clockTime: Date.now(),
        chatCount: 99,
        matchCount: 99,
      };
    } else {
      // 单次签到积分 +10 同时恢复私聊和匹配次数
      update = {
        $inc: { clockTotalCount: 1, score },
        clockContinuousCount: 1,
        clockTime: Date.now(),
        chatCount: 99,
        matchCount: 99,
      };
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
    const skip = Number(page || 0) * Number(limit || 20);
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
    totalCount = await ctx.model.Clock.countDocuments(query)
      .exec();

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
   * 通过 Id 查找一个评论
   * @param id
   */
  async find(id) {
    return this.ctx.model.Clock.findById(id)
      .exec();
  }

  /**
   * 查找今天打卡记录
   * @param userId
   */
  async findTodayCount(userId) {
    const startTime = new Date(new Date(new Date().toLocaleDateString()).getTime()); // 当天0点
    const endTime = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);// 当天23:59
    return this.ctx.model.Clock.countDocuments({ userId, createdAt: { $gte: startTime, $lte: endTime } });
  }

  /**
   * 查找昨天打卡记录
   * @param userId
   */
  async findYesterdayCount(userId) {
    const startTime = new Date(new Date(new Date().toLocaleDateString()).getTime() - 24 * 60 * 60 * 1000); // 昨天0点
    const endTime = new Date(new Date(new Date().toLocaleDateString()).getTime() - 1);// 昨天23:59
    return this.ctx.model.Clock.countDocuments({ userId, createdAt: { $gte: startTime, $lte: endTime } });
  }
}

module.exports = ClockService;
