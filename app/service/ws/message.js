/**
 * Create by lzan13 2020/7/7
 * 描述：内容信息处理服务
 */
'use strict';

const Service = require('egg').Service;

class MessageService extends Service {

  /**
   * 创建
   * @param params
   */
  async create(params) {
    const { ctx } = this;
    return await ctx.model.Message.create(params);
  }

  /**
   * 删除
   * @param id
   */
  async destroy(id) {
    const { ctx, service } = this;
    // 先判断下权限
    const message = await this.find(id);
    if (!message) {
      ctx.throw(404, `数据不存在 ${id}`);
    } else {
      const identity = ctx.state.user.identity;
      if (identity < 700) {
        ctx.throw(403, '无权操作');
      }
    }
    if (message.attachments) {
      message.attachments.forEach(item => {
        service.attachment.destroy(item.id);
      });
    }
    // 删除内容
    return ctx.model.Message.findByIdAndRemove(id);
  }

  /**
   * 更新内容
   * @param id
   * @param params
   */
  async update(id, params) {
    const { ctx } = this;
    // 先判断下权限
    const message = await this.find(id);
    if (!message) {
      ctx.throw(404, '数据不存在');
    }
    return this.findByIdAndUpdate(id, params);
  }

  /**
   * 获取一个内容
   * @param id
   */
  async show(id) {
    const { ctx } = this;
    const message = await this.find(id);
    if (!message) {
      ctx.throw(404, `数据不存在 ${id}`);
    }
    return message;
  }

  /**
   * 获取内容列表，可根据参数判断是否分页，搜索
   * @param params 查询参数
   */
  async index(params) {
    const { ctx } = this;
    const { page, limit, beginTime, endTime, from, to, status } = params;
    let result = [];
    let currentCount = 0;
    let totalCount = 0;
    // 计算分页
    const skip = Number(page || 0) * Number(limit || 20);
    // 组装查询参数
    const query = {};
    if (status) {
      query.status = status;
    }
    // 时间条件
    if (beginTime && endTime) {
      query.time = { $lte: beginTime, $gte: endTime };
    } else if (beginTime) {
      query.time = { $lte: beginTime };
    } else if (endTime) {
      query.time = { $gte: endTime };
    }
    // 会话对象
    if (from && to) {
      query.$or = [{ from, to }, { from: to, to: from }];
    } else if (from) {
      query.from = from;
    } else if (to) {
      query.to = to;
    }

    // 查询
    result = await ctx.model.Message.find(query)
      .populate('attachments', { duration: 1, extname: 1, path: 1, width: 1, height: 1 })
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .exec();
    currentCount = result.length;
    totalCount = await ctx.model.Message.countDocuments(query)
      .exec();

    // 整理数据源 -> Ant Design Pro
    const data = result.map(item => {
      const json = Object.assign({}, item._doc);
      // 格式化一下返回给客户端的时间戳样式
      // json.createdAt = ctx.helper.formatTime(item.createdAt);
      // json.updatedAt = ctx.helper.formatTime(item.updatedAt);
      return json;
    });

    return { currentCount, totalCount, page: Number(page || 0), limit: Number(limit || 20), data };
  }


  /**
   * ===================================================================================
   * 通用方法，主要是这些方法有多个地方调用，简单封装下
   */
  /**
   * 通过 Id 查找一个内容
   * @param id
   */
  async find(id) {
    return this.ctx.model.Message.findById(id)
      .populate('attachments', { duration: 1, extname: 1, path: 1, width: 1, height: 1 })
      .exec();
  }

  /**
   * 更新信息
   * @param id
   * @param params 需要更新的信息
   */
  async findByIdAndUpdate(id, params) {
    return this.ctx.model.Message.findByIdAndUpdate(id, params);
  }

  /**
   * 根据条件更新
   */
  async updateByQuery(query, params) {
    await this.ctx.model.Message.updateMany(query, params);
  }
  /**
   * 根据条件删除数据
   */
  async removeByQuery(query) {
    return this.ctx.model.Message.removeMany(query);
  }

}

module.exports = MessageService;
