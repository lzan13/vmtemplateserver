/**
 * Create by lzan13 2020/7/7
 * 描述：喜欢对外接口
 */
'use strict';

const Controller = require('egg').Controller;

class ClockController extends Controller {

  /**
   * 创建
   */
  async create() {
    const { ctx, service } = this;
    // 组装参数
    const { userId } = ctx.params;
    // 调用 Service 进行业务处理
    await service.clock.create(userId);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '签到成功' });
  }

  /**
   * 删除
   */
  async destroy() {
    const { ctx, service } = this;
    // 校验参数
    const { id } = ctx.params;
    // 调用 Service 进行业务处理
    await service.clock.destroy(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '删除数据成功' });
  }

  /**
   * 查询所有数据(分页/模糊)
   */
  async index() {
    const { ctx, service } = this;
    // 组装参数
    const params = ctx.params.permit('userId', 'page', 'limit');
    // 调用 Service 进行业务处理
    const likes = await service.clock.index(params);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '查询信息成功', data: likes });
  }

}


module.exports = ClockController;
