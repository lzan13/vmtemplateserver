/**
 * Create by lzan13 2021/7/2
 * 描述：配置对外接口
 */
'use strict';

const Controller = require('egg').Controller;

class ConfigController extends Controller {

  /**
   * 创建
   */
  async create() {
    const { ctx, service } = this;
    // 组装参数
    const params = ctx.params.permit('alias', 'title', 'desc', 'content');
    // 校验参数
    ctx.validate({ title: 'title', desc: 'desc' }, params);
    // 调用 Service 进行业务处理
    const config = await service.config.create(params);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '创建成功', data: config });
  }

  /**
   * 删除
   */
  async destroy() {
    const { ctx, service } = this;
    // 校验参数
    const { id } = ctx.params;
    // 调用 Service 进行业务处理
    await service.config.destroy(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '删除成功' });
  }

  /**
   * 修改配置
   */
  async update() {
    const { ctx, service } = this;
    // 组装参数
    const { id } = ctx.params;
    const params = ctx.params.permit('alias', 'title', 'desc', 'content');
    // 校验参数
    ctx.validate({ title: 'title?', desc: 'desc?' }, params);
    // 调用 Service 进行业务处理
    const config = await service.config.update(id, params);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '更新成功', data: config });
  }

  /**
   * 获取指定配置信息
   */
  async show() {
    const { ctx, service } = this;
    // 组装参数
    const { id } = ctx.params;
    // 调用 Service 进行业务处理
    const config = await service.config.show(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '获取成功', data: config });
  }

  /**
   * 查询所有配置(分页/模糊)
   */
  async index() {
    const { ctx, service } = this;
    // 组装参数
    const params = ctx.params;
    // 调用 Service 进行业务处理
    const configs = await service.config.index(params);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '查询成功', data: configs });
  }

}


module.exports = ConfigController;
