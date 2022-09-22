/**
 * Create by lzan13 2020/7/7
 * 描述：内容对外接口
 */
'use strict';

const Controller = require('egg').Controller;

class AppletController extends Controller {

  /**
   * 新建
   */
  async create() {
    const { ctx, service } = this;
    // 组装参数
    const params = ctx.params.permit('title', 'content', 'tips', 'isNeedVIP', 'status', 'type', 'appId', 'cover', 'body', 'url', 'versionCode', 'versionName');
    // 校验参数
    ctx.validate({ title: 'title', content: 'content', cover: 'string' }, params);

    // 调用 Service 进行业务处理
    const applet = await service.applet.create(params);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '创建成功', data: applet });
  }

  /**
   * 销毁
   */
  async destroy() {
    const { ctx, service } = this;
    // 校验参数
    const { id } = ctx.params;
    // 调用 Service 进行业务处理
    await service.applet.destroy(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '销毁成功' });
  }

  /**
   * 批量删除
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
      await service.applet.destroy(id);
    }
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '批量删除成功' });
  }

  /**
   * 修改内容
   */
  async update() {
    const { ctx, service } = this;
    // 组装参数
    const { id } = ctx.params;
    // 组装参数
    const params = ctx.params.permit('title', 'content', 'tips', 'isNeedVIP', 'status', 'type', 'appId', 'cover', 'body', 'url', 'versionCode', 'versionName');
    // 校验参数
    ctx.validate({ title: 'title?', content: 'content?' }, params);

    // 调用 Service 进行业务处理
    await service.applet.update(id, params);
    const applet = service.applet.find(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '更新内容成功', data: applet });
  }

  // 获取单个内容
  async show() {
    const { ctx, service } = this;
    // 组装参数
    const { id } = ctx.params;
    // 调用 Service 进行业务处理
    const applet = await service.applet.show(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '获取成功', data: applet });
  }

  /**
   * 查询所有内容(分页/模糊)
   */
  async index() {
    const { ctx, service } = this;
    // 组装参数
    const params = ctx.params;
    // 调用 Service 进行业务处理
    const applets = await service.applet.index(params);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '查询成功', data: applets });
  }

}


module.exports = AppletController;
