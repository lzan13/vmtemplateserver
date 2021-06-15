/**
 * Create by lzan13 2020/7/7
 * 描述：关注关系对外接口
 */
'use strict';

const Controller = require('egg').Controller;

class FollowController extends Controller {

  /**
   * 关注
   */
  async create() {
    const { ctx, service } = this;
    // 组装参数
    const { id } = ctx.params;
    // 调用 Service 进行业务处理
    await service.follow.create(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '关注成功' });
  }

  /**
   * 取消关注
   */
  async destroy() {
    const { ctx, service } = this;
    // 校验参数
    const { id } = ctx.params;
    // 调用 Service 进行业务处理
    await service.follow.destroy(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '取消关注成功' });
  }

  /**
   * 批量删除关注
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
      await service.follow.destroy(id);
    }
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '批量删除关注成功' });
  }

  /**
   * 查询所有关注(分页/模糊)
   */
  async index() {
    const { ctx, service } = this;
    // 组装参数
    const params = ctx.params;
    // 调用 Service 进行业务处理
    const follows = await service.follow.index(params);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '查询关注信息成功', data: follows });
  }

}


module.exports = FollowController;
