/**
 * Create by lzan13 2020/7/7
 * 描述：反馈信息处理服务
 */
'use strict';

const Service = require('egg').Service;

class FeedbackService extends Service {

  /**
   * 创建一个新反馈
   * @param params
   */
  async create(params) {
    return await this.ctx.model.Feedback.create(params);
  }

  /**
   * 删除一个反馈
   * @param id
   */
  async destroy(id) {
    const { ctx, service } = this;
    const role = await service.feedback.find(id);
    if (!role) {
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
   * 获取一个反馈
   * @param id
   */
  async show(id) {
    const { ctx, service } = this;
    const role = await service.feedback.find(id);
    if (!role) {
      ctx.throw(404, `反馈不存在 ${id}`);
    }
    return role;
  }

  /**
   * 获取反馈列表，可根据参数判断是否分页，搜索
   * @param params 查询参数
   */
  async index(params) {
    const { ctx } = this;
    const { page, limit, contact } = params;
    let result = [];
    let currentCount = 0;
    let totalCount = 0;
    // 计算分页
    const skip = Number(page) * Number(limit || 20);
    // 组装查询参数
    const query = {};
    if (contact) {
      query.contact = contact;
    }
    result = await ctx.model.Feedback.find(query)
      .populate('attachment', { extname: 1, path: 1 })
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .exec();
    currentCount = result.length;
    totalCount = await ctx.model.Feedback.count(query)
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
      .populate('attachment', { extname: 1, path: 1 })
      .exec();
  }

}

module.exports = FeedbackService;
