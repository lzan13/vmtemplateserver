/**
 * Create by lzan13 2020/7/7
 * 描述：版本对外接口
 */
'use strict';

const Controller = require('egg').Controller;

class VersionController extends Controller {

  /**
   * 创建版本
   */
  async create() {
    const { ctx, service } = this;
    // 组装参数
    const params = ctx.params.permit('platform', 'title', 'desc', 'url', 'versionCode', 'versionName', 'force');
    // 校验参数
    ctx.validate({ title: 'title', desc: 'desc' }, params);
    // 调用 Service 进行业务处理
    const version = await service.version.create(params);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '创建版本成功', data: version });
  }

  /**
   * 删除版本
   */
  async destroy() {
    const { ctx, service } = this;
    // 校验参数
    const { id } = ctx.params;
    // 调用 Service 进行业务处理
    await service.version.destroy(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '删除版本成功' });
  }

  /**
   * 修改版本
   */
  async update() {
    const { ctx, service } = this;
    // 组装参数
    const { id } = ctx.params;
    const params = ctx.params.permit('platform', 'title', 'desc', 'url', 'versionCode', 'versionName', 'force');
    // 校验参数
    ctx.validate({ title: 'title', desc: 'desc' }, params);
    // 调用 Service 进行业务处理
    const version = await service.version.update(id, params);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '更新版本成功', data: version });
  }

  // 获取单个版本
  async show() {
    const { ctx, service } = this;
    // 组装参数
    const { id } = ctx.params;
    // 调用 Service 进行业务处理
    const version = await service.version.show(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '获取版本成功', data: version });
  }

  /**
   * 查询所有版本(分页/模糊)
   */
  async index() {
    const { ctx, service } = this;
    // 组装参数
    const params = ctx.params;
    // 调用 Service 进行业务处理
    const versions = await service.version.index(params);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '查询版本成功', data: versions });
  }

}


module.exports = VersionController;
