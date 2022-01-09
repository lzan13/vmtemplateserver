/**
 * Create by lzan13 2021/8/9
 * 描述：订单信息处理服务
 */
'use strict';

const Service = require('egg').Service;

class OrderService extends Service {

  /**
   * 创建
   * @param params
   * Order validation failed: extend: Cast to string failed for value \"{\n  wxCode: 'http://zyphoto.itluntan.cn/20210809161857',\n  zfbCode: 'http://zyphoto.itluntan.cn/20210809161957',\n  zfbScheme: 'alipayqr://platformapi/startapp?saId=10000007&qrcode=https%3A%2F%2Fqr.alipay.com%2Ftsx14575pzorxigphwtdj84',\n  afbPayUrl: 'https://admin.zhanzhangfu.com/common/zfbuserid?zfbuserid=2088602250620913&price=2.97'\n}\" at path \"extend\""
   */
  async create(params) {
    const { ctx, service } = this;
    if (!params.owner) {
      params.owner = ctx.state.user.id;
    }
    const order = await service.third.pay.createOrder(params);
    if (!order || order.code !== '0' || order.orderId === '') {
      ctx.throw(500, '订单创建失败');
    }
    params.orderId = order.orderId;
    params.realPrice = order.price;
    params.status = 0;
    params.extend = JSON.stringify({
      wxCode: order.wxcode,
      zfbCode: order.zfbcode,
      zfbScheme: order.qrcode,
      afbPayUrl: order.zfbuseridcode,
    });

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
    if (identity < 200 && order.owner !== userId) {
      ctx.throw(403, '无权操作，普通用户只能操作自己创建的订单');
    }
    // 删除
    return ctx.model.Order.findByIdAndRemove(id);
  }

  /**
   * 更新信息
   * @param id
   * @param params
   */
  async update(params) {
    const { ctx, service } = this;
    // 先判断下权限
    const order = await service.order.find(params.id);
    if (!order) {
      ctx.throw(404, '订单不存在');
    }
    const identity = ctx.state.user.identity;
    if (identity < 200) {
      ctx.throw(403, '无权操作，普通用户不能直接修改订单');
    }
    return service.order.findByIdAndUpdate(params.id, params);
  }

  /**
   * 获取信息
   * @param id
   */
  async show(id) {
    const { ctx, service } = this;
    const order = await service.order.find(id);
    if (!order) {
      ctx.throw(404, `订单不存在 ${id}`);
    }
    // 如果订单支付状态待支付，则去支付那里查询下状态进行更新
    if (order.status === 0) {
      // 查询下支付状态
      const result = await service.third.pay.findOrder(order.orderId);
      // 更新支付状态
      order.status = result.status;
      await service.order.update(order.id, order);
    }

    return order;
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
    const skip = Number(page) * Number(limit || 20);
    // 组装查询参数
    const query = {};
    if (owner) {
      query.owner = owner;
    } else {
      const userId = ctx.state.user.id;
      const identity = ctx.state.user.identity;
      if (identity < 200) {
        // 普通用户只能查询自己的数据
        query.owner = userId;
      }
    }
    result = await ctx.model.Order.find(query)
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
    return this.ctx.model.Order.findById(id);
  }

  /**
   * 通过 orderId 查找
   */
  async findOrderId(orderId) {
    return this.ctx.model.Order.findOne({ orderId });
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
