/**
 * Create by lzan13 2021/11/18
 * 描述：商品信息处理服务
 */
'use strict';

const Service = require('egg').Service;

class CommodityService extends Service {

  /**
   * 创建一个新商品
   */
  async create(params) {
    return await this.ctx.model.Commodity.create(params);
  }

  /**
   * 删除一个商品
   */
  async destroy(id) {
    const { ctx, service } = this;
    // 先判断下权限
    const commodity = await service.commodity.find(id);
    if (!commodity) {
      ctx.throw(404, `商品不存在 ${id}`);
    } else {
      const identity = ctx.state.user.identity;
      if (identity < 200) {
        ctx.throw(403, '无权操作');
      }
    }
    // 删除商品
    return ctx.model.Commodity.findByIdAndRemove(id);
  }

  /**
   * 更新商品
   * @param id
   * @param params
   */
  async update(id, params) {
    const { ctx, service } = this;
    // 先判断下权限
    const commodity = await service.commodity.find(id);
    if (!commodity) {
      ctx.throw(404, '商品不存在');
    } else {
      const identity = ctx.state.user.identity;
      if (identity < 200) {
        ctx.throw(403, '无权操作');
      }
    }
    return service.commodity.findByIdAndUpdate(id, params);
  }

  /**
   * 获取一个商品
   * @param id
   */
  async show(id) {
    const { ctx, service } = this;
    const commodity = await service.commodity.find(id);
    if (!commodity) {
      ctx.throw(404, `商品不存在 ${id}`);
    }
    return commodity;
  }

  /**
   * 获取商品列表，可根据参数判断是否分页，搜索
   * @param params 查询参数
   */
  async index(params) {
    const { ctx } = this;
    const { page, limit, status, type } = params;
    let result = [];
    let currentCount = 0;
    let totalCount = 0;
    // 计算分页
    const skip = Number(page) * Number(limit || 20);
    // 组装查询参数
    const query = {};
    if (status) {
      query.status = status;
    }
    if (type) {
      query.type = type;
    }

    result = await ctx.model.Commodity.find(query)
      .populate('attachments', { extname: 1, path: 1, width: 1, height: 1 })
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .exec();
    currentCount = result.length;
    totalCount = await ctx.model.Commodity.countDocuments(query).exec();

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
   * 通过 Id 查找一个商品
   * @param id
   */
  async find(id) {
    return this.ctx.model.Commodity.findById(id)
      .populate('attachments', { extname: 1, path: 1, width: 1, height: 1 })
      .exec();
  }

  /**
   * 更新商品信息
   * @param id
   * @param params 需要更新的信息
   */
  async findByIdAndUpdate(id, params) {
    return this.ctx.model.Commodity.findByIdAndUpdate(id, params);
  }

}

module.exports = CommodityService;
