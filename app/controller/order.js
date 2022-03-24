/**
 * Create by lzan13 2021/8/9
 * 描述：订单对外接口
 */
'use strict';

const Controller = require('egg').Controller;

class OrderController extends Controller {

  /**
   * 创建
   */
  async create() {
    const { ctx, service } = this;
    // 组装参数
    const params = ctx.params.permit('commoditys', 'remarks');

    // 调用 Service 进行业务处理
    let order = await service.order.create(params);
    // 这里在查询一下
    order = await service.order.show(order.id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '创建成功', data: order });
  }

  /**
   * 销毁
   */
  async destroy() {
    const { ctx, service } = this;
    // 校验参数
    const { id } = ctx.params;
    // 调用 Service 进行业务处理
    await service.order.destroy(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '销毁成功' });
  }

  /**
   * 批量销毁
   * 参数 {ids: "5a452a44ab122b16a0231b42,5a452a3bab122b16a0231b41"}
   */
  async destroyList() {
    const { ctx, service } = this;
    // 组装参数
    const { ids } = ctx.params;
    const idArray = ids.split(',') || [];
    // 设置响应内容和响应状态码
    for (const id of idArray) {
      // 调用 Service 进行业务处理
      await service.order.destroy(id);
    }
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '批量销毁成功' });
  }

  /**
   * 修改
   */
  async update() {
    const { ctx, service } = this;
    // 组装参数
    const params = ctx.params.permit('id', 'price', 'realPrice', 'status', 'title', 'type', 'remarks', 'extend');

    // 调用 Service 进行业务处理
    await service.order.update(params);
    // 查询下更新后的数据
    const order = service.order.find(params.id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '更新成功', data: order });
  }

  // 获取单个内容
  async show() {
    const { ctx, service } = this;
    // 组装参数
    const { id } = ctx.params;
    // 调用 Service 进行业务处理
    const order = await service.order.show(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '获取成功', data: order });
  }

  // 获取订单支付信息
  async payInfo() {
    const { ctx, service } = this;
    // 组装参数
    const { id } = ctx.params;
    // 调用 Service 进行业务处理
    const order = await service.order.payInfo(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '获取成功', data: order });
  }

  /**
   * 查询所有(分页/模糊)
   */
  async index() {
    const { ctx, service } = this;
    // 组装参数
    const params = ctx.params;
    // 调用 Service 进行业务处理
    const orders = await service.order.index(params);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '查询成功', data: orders });
  }

}


module.exports = OrderController;
