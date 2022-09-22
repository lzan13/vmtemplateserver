/**
 * Create by lzan13 2022/04/07
 * 描述：拉黑关系对外接口
 */
'use strict';

const Controller = require('egg').Controller;

class BlacklistController extends Controller {

  /**
   * 新建
   */
  async create() {
    const { ctx, service } = this;
    // 组装参数
    const { id } = ctx.params;
    // 调用 Service 进行业务处理
    await service.blacklist.create(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '拉黑成功' });
  }

  /**
   * 删除
   */
  async destroy() {
    const { ctx, service } = this;
    // 校验参数
    const { id } = ctx.params;
    // 调用 Service 进行业务处理
    await service.blacklist.destroy(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '删除拉黑成功' });
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
      await service.blacklist.destroy(id);
    }
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '批量删除成功' });
  }

  /**
   * 取消拉黑
   */
  async cancel() {
    const { ctx, service } = this;
    // 校验参数
    const { id } = ctx.params;
    // 调用 Service 进行业务处理
    await service.blacklist.cancel(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '取消拉黑成功' });
  }

  /**
   * 修改关系
   */
  async update() {
    const { ctx, service } = this;
    // 组装参数
    const { id } = ctx.params;
    const params = ctx.params.permit('relation');
    // 调用 Service 进行业务处理
    const category = await service.blacklist.update(id, params);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '更新关系成功', data: category });
  }

  /**
   * 查询所有拉黑(分页/模糊)
   */
  async index() {
    const { ctx, service } = this;
    // 组装参数
    const params = ctx.params;
    // 调用 Service 进行业务处理
    const blacklists = await service.blacklist.index(params);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '查询拉黑信息成功', data: blacklists });
  }

}


module.exports = BlacklistController;
