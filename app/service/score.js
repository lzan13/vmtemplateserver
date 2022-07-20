/**
 * Create by lzan13 2022/05/24
 * 描述：交易记录数据处理服务
 */
'use strict';

const Service = require('egg').Service;
const userSelect = {
  username: 1,
  avatar: 1,
  cover: 1,
  gender: 1,
  nickname: 1,
  signature: 1,
  role: 1,
  deleted: 1,
  deletedReason: 1,
};

class ScoreService extends Service {

  /**
   * 创建
   * @param params
   */
  async create(params) {
    const { ctx } = this;
    // const identity = ctx.state.user.identity;
    // if (identity < 200) {
    //   ctx.throw(403, '无权操作');
    // }
    if (!params.cover || params.cover === '') {
      delete params.cover;
    }
    if (!params.animation || params.animation === '') {
      delete params.animation;
    }
    return await ctx.model.Score.create(params);
  }

  /**
   * 删除
   * @param id
   */
  async destroy(id) {
    const { ctx, service } = this;
    // 先判断下权限
    const identity = ctx.state.user.identity;
    if (identity < 200) {
      ctx.throw(403, '无权操作');
    }
    const score = await service.score.find(id);
    if (!score) {
      ctx.throw(404, `数据不存在 ${id}`);
    }
    // 删除封面
    service.attachment.destroy(score.cover);
    // 删除特效数据
    service.attachment.destroy(score.animation);
    // 删除
    return ctx.model.Score.findByIdAndRemove(id);
  }

  /**
   * 更新内容
   * @param id
   * @param params
   */
  async update(id, params) {
    const { ctx, service } = this;
    // 先判断下权限
    const identity = ctx.state.user.identity;
    if (identity < 200) {
      ctx.throw(403, '无权操作');
    }
    const score = await service.score.find(id);
    if (!score) {
      ctx.throw(404, '数据不存在');
    }
    if (params.cover) {
      if (score.cover && score.cover.id !== params.cover) {
        service.attachment.destroy(params.cover);
      }
    } else {
      delete params.cover;
    }
    if (params.animation) {
      if (score.animation && score.animation.id !== params.animation) {
        service.attachment.destroy(params.animation);
      }
    } else {
      delete params.animation;
    }
    return service.score.findByIdAndUpdate(id, params);
  }

  /**
   * 获取一个内容
   * @param id
   */
  async show(id) {
    const { ctx, service } = this;
    const score = await service.score.find(id);
    if (!score) {
      ctx.throw(404, `数据不存在 ${id}`);
    }
    return score;
  }

  /**
   * 获取数据列表，可根据参数判断是否分页，搜索
   * @param params 查询参数
   */
  async index(params) {
    const { ctx } = this;
    const { page, limit, owner } = params;
    let result = [];
    let currentCount = 0;
    let totalCount = 0;
    // 计算分页
    const skip = Number(page || 0) * Number(limit || 20);
    // 组装查询参数
    const query = {};
    if (owner) {
      query.owner = owner;
    }

    result = await ctx.model.Score.find(query)
      .skip(skip)
      .populate('owner', userSelect)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .exec();
    currentCount = result.length;
    totalCount = await ctx.model.Score.countDocuments(query).exec();

    // 整理数据源 -> Ant Design Pro
    const data = result.map(item => {
      const json = Object.assign({}, item._doc);
      // 格式化一下返回给客户端的时间戳样式
      // json.createdAt = ctx.helper.formatTime(item.createdAt);
      // json.updatedAt = ctx.helper.formatTime(item.updatedAt);
      return json;
    });

    return { currentCount, totalCount, page: Number(page), limit: Number(limit), data };
  }


  /**
   * ===================================================================================
   * 通用方法，主要是这些方法有多个地方调用，简单封装下
   */
  /**
   * 通过 Id 查找
   * @param id
   */
  async find(id) {
    return this.ctx.model.Score.findById(id)
      .populate('owner', userSelect)
      .exec();
  }

  /**
   * 更新
   * @param id
   * @param params 需要更新的信息
   */
  async findByIdAndUpdate(id, params) {
    return this.ctx.model.Score.findByIdAndUpdate(id, params);
  }

}

module.exports = ScoreService;
