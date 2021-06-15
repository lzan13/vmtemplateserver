/**
 * Create by lzan13 2020/8/24
 * 描述：在线信息处理服务
 */
'use strict';

const Service = require('egg').Service;

class OnlineService extends Service {

  /**
   * 创建一条新在线数据
   * @param params
   */
  async create(params) {
    return this.ctx.model.Online.create(params);
  }

  /**
   * 删除一条在线数据
   * @param userId
   */
  async destroy(filter) {
    const { ctx, service } = this;
    const online = await service.online.findOne(filter);
    if (!online) {
      // ctx.throw(404, `在线信息不存在 ${online}`);
      return;
    }
    return ctx.model.Online.findOneAndRemove(filter);
  }

  /**
   * 更新在线信息
   * @param filter
   * @param params
   */
  async update(filter, params) {
    const { service } = this;
    const online = await service.online.findOne(filter);
    if (!online) {
      // ctx.throw(404, `在线数据不存在 ${params.userId}`);
      return;
    }
    return service.online.findOneAndUpdate(filter, params);
  }

  /**
   * 获取在线列表，可根据参数判断是否分页，搜索
   * @param params 查询参数
   */
  async index(params) {
    const { ctx } = this;
    const { page, limit } = params;
    let result = [];
    let currentCount = 0;
    let totalCount = 0;
    // 计算分页
    const skip = Number(page) * Number(limit || 20);
    // 组装查询参数
    const query = {};

    result = await ctx.model.Online.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .exec();
    currentCount = result.length;
    totalCount = await ctx.model.Online.count(query).exec();

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
   * 通过 Id 查找一个在线数据
   * @param id
   */
  async find(id) {
    return this.ctx.model.Online.findById(id);
  }

  /**
   * 查找一个在线数据
   * @param filter 过滤条件
   */
  async findOne(filter) {
    return this.ctx.model.Online.findOne(filter);
  }

  /**
   * 更新在线信息
   * @param filter 需要更新的过滤条件
   * @param params 需要更新的信息
   */
  async findOneAndUpdate(filter, params) {
    return this.ctx.model.Online.findOneAndUpdate(filter, params, { new: true });
  }

}

module.exports = OnlineService;
