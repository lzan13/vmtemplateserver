/**
 * Create by lzan13 2021/8/9
 * 描述：订单信息处理服务
 */
'use strict';

const Service = require('egg').Service;

class OrderService extends Service {

  /**
   * 创建
   */
  async create(params) {
    const { ctx, service } = this;
    if (!params.owner) {
      params.owner = ctx.state.user.id;
    }
    // 查询下商品信息 TODO 这里有一点需要注意，commoditys 本身是集合参数，单当集合只有一个时，服务器获取到的参数直接是集合内的第一个参数
    const commodity = await service.commodity.show(params.commoditys);
    if (!commodity || commodity.status !== 1) {
      ctx.throw(500, '商品信息有误，订单创建失败');
    }
    params.price = commodity.price;
    params.realPrice = commodity.currPrice;
    params.title = commodity.title;

    return ctx.model.Order.create(params);
  }

  /**
   * 删除
   * @param id 订单 id
   */
  async destroy(id) {
    const { ctx, service } = this;
    // 先判断下权限
    const order = await service.order.find(id);
    if (!order) {
      ctx.throw(404, `订单不存在 ${id}`);
    }
    const userId = ctx.state.user.id;
    const identity = ctx.state.user.identity;
    // 权限判断
    if (identity < 700 && order.owner !== userId) {
      ctx.throw(403, '无权操作，普通用户只能操作自己创建的订单');
    }
    // 删除
    return ctx.model.Order.findByIdAndRemove(id);
  }

  /**
   * 批量删除
   * @param ids 需要删除的 Id 集合
   */
  async destroyList(ids) {
    const { ctx } = this;
    const identity = ctx.state.user.identity;
    if (identity < 700) {
      ctx.throw(403, '无权操作，请联系管理员开通权限');
    }
    return ctx.model.Order.remove({ _id: { $in: ids } });
  }
  /**
   * 更新信息
   * @param params
   */
  async update(params) {
    const { ctx, service } = this;
    // 先判断下权限
    const identity = ctx.state.user.identity;
    if (identity < 700) {
      ctx.throw(403, '无权操作，普通用户不能直接修改订单');
    }
    // 先判断下权限
    const order = await service.order.find(params.id);
    if (!order) {
      ctx.throw(404, '订单不存在');
    }
    return service.order.findByIdAndUpdate(params.id, params);
  }

  /**
   * 获取信息
   */
  async show(id) {
    const { ctx, service } = this;
    const order = await service.order.find(id);
    if (!order) {
      ctx.throw(404, `订单不存在 ${id}`);
    }
    // 判断下权限
    const userId = ctx.state.user.id;
    const identity = ctx.state.user.identity;
    if (identity < 700 && order.owner !== userId) {
      ctx.throw(403, '无权操作，普通用户不能查看他人订单信息');
    }

    return order;
  }

  /**
   * 获取订单支付信息
   */
  async payInfo(id) {
    const { ctx, service } = this;
    const order = await service.order.find(id);
    if (!order) {
      ctx.throw(404, `订单不存在 ${id}`);
    }
    // 判断下权限
    const userId = ctx.state.user.id;
    const identity = ctx.state.user.identity;
    if (identity < 700 && order.owner !== userId) {
      ctx.throw(403, '无权操作，普通用户不能获取他人订单信息');
    }
    const payInfo = await service.third.pay.payInfo(order);

    return payInfo;
  }

  /**
   * 获取内容列表，可根据参数判断是否分页，搜索
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
    } else {
      const userId = ctx.state.user.id;
      const identity = ctx.state.user.identity;
      if (identity < 700) {
        // 普通用户只能查询自己的数据
        query.owner = userId;
      }
    }
    result = await ctx.model.Order.find(query)
      .populate({
        path: 'commoditys',
        select: { title: 1, price: 1 },
        populate: [
          { path: 'attachments', select: { path: 1 } },
        ],
      })
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .exec();
    currentCount = result.length;
    totalCount = await ctx.model.Order.countDocuments(query)
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
   * 通过 Id 查找
   * @param id
   */
  async find(id) {
    return this.ctx.model.Order.findById(id).populate({
      path: 'commoditys',
      select: { title: 1, price: 1, type: 1, level: 1 },
      populate: [
        { path: 'attachments', select: { path: 1 } },
      ],
    });
  }

  /**
   * 更新信息
   * @param id
   * @param params 需要更新的信息
   */
  async findByIdAndUpdate(id, params) {
    return this.ctx.model.Order.findByIdAndUpdate(id, params);
  }

}

module.exports = OrderService;
