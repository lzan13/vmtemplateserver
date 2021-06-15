/**
 * Create by lzan13 2020/7/7
 * 描述：分类对外接口
 */
'use strict';

const Controller = require('egg').Controller;

class CategoryController extends Controller {

  /**
   * 创建分类
   */
  async create() {
    const { ctx, service } = this;
    // 组装参数
    const params = ctx.params.permit('title', 'desc');
    // 校验参数
    ctx.validate({ title: 'title', desc: 'desc' }, params);
    // 调用 Service 进行业务处理
    const category = await service.category.create(params);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '创建分类成功', data: category });
  }

  /**
   * 删除分类
   */
  async destroy() {
    const { ctx, service } = this;
    // 校验参数
    const { id } = ctx.params;
    // 调用 Service 进行业务处理
    await service.category.destroy(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '删除分类成功' });
  }

  /**
   * 批量删除分类
   * 参数 {ids: "5a452a44ab122b16a0231b42,5a452a3bab122b16a0231b41"}
   */
  async destroyList() {
    const { ctx, service } = this;
    // 组装参数
    const { ids } = ctx.params;
    const params = ids.split(',') || [];
    // 调用 Service 进行业务处理
    await service.category.destroyList(params);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '批量删除分类成功' });
  }

  /**
   * 修改分类
   */
  async update() {
    const { ctx, service } = this;
    // 组装参数
    const { id } = ctx.params;
    const params = ctx.params.permit('title', 'desc');
    // 校验参数
    ctx.validate({ title: 'title', desc: 'desc' }, params);
    // 调用 Service 进行业务处理
    const category = await service.category.update(id, params);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '更新分类成功', data: category });
  }

  // 获取单个分类
  async show() {
    const { ctx, service } = this;
    // 组装参数
    const { id } = ctx.params;
    // 调用 Service 进行业务处理
    const category = await service.category.show(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '获取分类成功', data: category });
  }

  /**
   * 查询所有分类(分页/模糊)
   */
  async index() {
    const { ctx, service } = this;
    // 组装参数
    const params = ctx.params;
    // 调用 Service 进行业务处理
    const categorys = await service.category.index(params);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '查询分类成功', data: categorys });
  }

}


module.exports = CategoryController;
