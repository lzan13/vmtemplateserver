/**
 * Create by lzan13 2021/7/2
 * 描述：商品对外接口
 */
'use strict';

const Controller = require('egg').Controller;

class CommodityController extends Controller {

  /**
   * 创建
   */
  async create() {
    const { ctx, service } = this;
    // 组装参数
    const params = ctx.params.permit('title', 'desc', 'price', 'currPrice', 'attachments', 'status', 'inventory', 'type', 'remarks');
    // 校验参数
    ctx.validate({ title: 'title', desc: 'desc?' }, params);
    // 调用 Service 进行业务处理
    const commodity = await service.commodity.create(params);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '创建成功', data: commodity });
  }

  /**
   * 删除
   */
  async destroy() {
    const { ctx, service } = this;
    // 校验参数
    const { id } = ctx.params;
    // 调用 Service 进行业务处理
    await service.commodity.destroy(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '删除成功' });
  }

  /**
   * 修改商品
   */
  async update() {
    const { ctx, service } = this;
    // 组装参数
    const { id } = ctx.params;
    const params = ctx.params.permit('title', 'desc', 'price', 'currPrice', 'attachments', 'status', 'inventory', 'type', 'remarks');
    // 校验参数
    ctx.validate({ title: 'title?', desc: 'desc?' }, params);
    // 调用 Service 进行业务处理
    const commodity = await service.commodity.update(id, params);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '更新成功', data: commodity });
  }

  /**
   * 获取指定商品信息
   */
  async show() {
    const { ctx, service } = this;
    // 组装参数
    const { id } = ctx.params;
    // 调用 Service 进行业务处理
    const commodity = await service.commodity.show(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '获取成功', data: commodity });
  }

  /**
   * 查询所有商品(分页/模糊)
   */
  async index() {
    const { ctx, service } = this;
    // 组装参数
    const params = ctx.params;
    // 调用 Service 进行业务处理
    const commoditys = await service.commodity.index(params);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '查询成功', data: commoditys });
  }

}


module.exports = CommodityController;
