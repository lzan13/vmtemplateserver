/**
 * Create by lzan13 2020/7/7
 * 描述：匹配信息处理服务
 */
'use strict';

const Service = require('egg').Service;
const userSelect = {
  username: 1,
  avatar: 1,
  gender: 1,
  nickname: 1,
};

class MatchService extends Service {

  /**
   * 创建一条新纪录
   */
  async create(params) {
    const { ctx } = this;
    const id = ctx.state.user.id;
    // 查询是否有提交匹配数据
    const match = await ctx.service.match.findByUserId(id);
    let data = { ...params };
    if (match) {
      // 存在匹配数据，可供匹配次数+1
      data = {
        $inc: { fromCount: 1 },
        ...params,
      };
      return ctx.model.Match.findOneAndUpdate({ user: id }, data);
    }
    // 首次提交匹配数据，直接创建
    data.user = id;
    return ctx.model.Match.create(data);
  }

  /**
   * 删除一条记录
   */
  async destroy(id) {
    const { ctx, service } = this;
    const match = await service.match.find(id);
    if (!match) {
      ctx.throw(404, `记录不存在 ${id}`);
    }
    return ctx.model.Match.findByIdAndRemove(id);
  }

  /**
   * 随机获取一条数据
   */
  async random(params) {
    const { ctx, service } = this;
    const { gender, type } = params;
    let result = [];
    const limit = 50;
    // 过滤掉自己
    const currId = ctx.state.user.id;
    const query = {
      user: { $ne: currId },
      fromCount: { $gte: 0 }, // 防止男女比例差别过大，这里暂时放开匹配限制
    };

    if (gender === '0') {
      query.gender = { $ne: 1 };
    } else if (gender === '1') {
      query.gender = { $ne: 0 };
    }

    if (type) {
      query.type = type;
    }
    const user = await service.user.find(currId);
    // 会员身份不需要消耗积分
    if (user.role.identity < 100) {
      if (user.score <= 0) {
        ctx.throw(412, '忘忧币不足，可通过签到或完成每日任务获取');
      } else {
        // 用户积分-1
        let update = { $inc: { score: -1 } };
        if (user.matchCount > 0) {
          update = { $inc: { matchCount: -1 } };
        }
        service.user.findByIdAndUpdate(currId, update);
      }
    }

    // 这里加上随机跳过是为了保证能随机到所有的匹配数据
    // 查询总数
    const totalCount = await ctx.model.Match.countDocuments()
      .exec();
    // 随机跳过
    let skip = Math.floor(Math.random() * (totalCount - 1));
    if (skip > 50) {
      skip -= 50;
    }

    // 查询最近的指定条数数据，然后在结果中随机选择一条返回
    result = await ctx.model.Match.find(query)
      .populate('user', userSelect)
      .skip(skip)
      .limit(limit)
      .sort({ updatedAt: -1 })
      .exec();

    if (result.length === 0) {
      ctx.throw(404, '哎呀对方走掉了');
    }

    const match = result[Math.floor(Math.random() * result.length)];

    // 获取到的匹配数据最大可供匹配次数-1
    const update = { $inc: { fromCount: -1, toCount: +1 } };
    await ctx.model.Match.findOneAndUpdate({ user: match.user.id }, update);

    return match;
  }


  /**
   * 获取列表，可根据参数判断是否分页，搜索
   * @param params 查询参数
   */
  async index(params) {
    const { ctx } = this;
    const { page, limit, gender, type } = params;
    let result = [];
    let currentCount = 0;
    let totalCount = 0;
    // 计算分页
    const skip = Number(page || 0) * Number(limit || 20);

    // 过滤掉自己
    const currId = ctx.state.user.id;
    // 组装查询参数
    const query = {
      user: { $ne: currId },
      fromCount: { $gte: 0 }, // 防止男女比例差别过大，这里暂时放开匹配限制
    };
    if (gender === '0') {
      query.gender = { $ne: 1 };
    } else if (params.gender === '1') {
      query.gender = { $ne: 0 };
    }
    if (type) {
      query.type = type;
    }
    result = await ctx.model.Match.find(query)
      .populate('user', userSelect)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .exec();
    currentCount = result.length;
    totalCount = await ctx.model.Match.countDocuments(query)
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
   * 通过ID查找匹配数据
   * @param  匹配 id
   */
  async find(id) {
    return this.ctx.model.Match.findById(id)
      .populate('user', userSelect)
      .exec();
  }

  /**
   * 通过用户ID查找
   * @param userId 用户 id
   */
  async findByUserId(userId) {
    return this.ctx.model.Match.findOne({ user: userId });
  }

}

module.exports = MatchService;
