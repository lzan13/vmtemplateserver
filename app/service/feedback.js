/**
 * Create by lzan13 2020/7/7
 * 描述：反馈信息处理服务
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
  deleted: 1,
  deletedReason: 1,
};

class FeedbackService extends Service {

  /**
   * 创建一个新反馈
   * @param params
   */
  async create(params) {
    const { ctx } = this;
    if (!params.owner && ctx.state.user && ctx.state.user.id) {
      params.owner = ctx.state.user.id;
    }
    return await ctx.model.Feedback.create(params);
  }

  /**
   * 删除一个反馈
   */
  async destroy(id) {
    const { ctx, service } = this;
    const like = await service.feedback.find(id);
    if (!like) {
      ctx.throw(404, `反馈不存在 ${id}`);
    }
    return ctx.model.Feedback.findByIdAndRemove(id);
  }

  /**
   * 批量删除反馈
   * @param ids 需要删除的反馈 Id 集合
   */
  async destroyList(ids) {
    return this.ctx.model.Feedback.remove({ _id: { $in: ids } });
  }

  /**
   * 更新反馈
   * @param id
   * @param params
   */
  async update(id, params) {
    const { ctx, service } = this;
    const feedback = await service.feedback.find(id);
    if (!feedback) {
      ctx.throw(404, `反馈不存在 ${id}`);
    }

    return service.feedback.findByIdAndUpdate(id, params);
  }

  /**
   * 获取一个反馈
   * @param id
   */
  async show(id) {
    const { ctx, service } = this;
    const like = await service.feedback.find(id);
    if (!like) {
      ctx.throw(404, `反馈不存在 ${id}`);
    }
    return like;
  }

  /**
   * 获取反馈列表，可根据参数判断是否分页，搜索
   * @param params 查询参数
   */
  async index(params) {
    const { ctx } = this;
    const { page, limit, owner, contact, status, type } = params;
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
    if (contact) {
      query.contact = contact;
    }
    if (status) {
      query.status = Number(status);
    }
    if (type) {
      query.type = Number(type);
    }
    result = await ctx.model.Feedback.find(query)
      .populate('owner', userSelect)
      .populate('user', userSelect)
      .populate('post', { title: 1 })
      .populate('comment', { content: 1 })
      .populate('attachments', { extname: 1, path: 1, width: 1, height: 1 })
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .exec();
    currentCount = result.length;
    totalCount = await ctx.model.Feedback.countDocuments(query)
      .exec();

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
   * 通过 Id 查找一个反馈
   * @param id
   */
  async find(id) {
    return this.ctx.model.Feedback.findById(id)
      .populate('owner', userSelect)
      .populate('attachments', { extname: 1, path: 1, width: 1, height: 1 })
      .exec();
  }

  /**
   * 更新反馈信息
   * @param id
   * @param params 需要更新的信息
   */
  async findByIdAndUpdate(id, params) {
    return this.ctx.model.Feedback.findByIdAndUpdate(id, params, { new: true });
  }
}

module.exports = FeedbackService;
