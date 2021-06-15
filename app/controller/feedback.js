/**
 * Create by lzan13 2020/7/7
 * 描述：反馈对外接口
 */
'use strict';

const Controller = require('egg').Controller;

class FeedbackController extends Controller {

  /**
   * 创建反馈
   */
  async create() {
    const { ctx, service } = this;
    // 组装参数
    const params = ctx.params.permit('contact', 'content', 'attachment');
    // 校验参数
    // ctx.validate({ content: 'content' }, params);
    // 调用 Service 进行业务处理
    const role = await service.feedback.create(params);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '反馈成功', data: role });
  }

  /**
   * 删除反馈
   */
  async destroy() {
    const { ctx, service } = this;
    // 校验参数
    const { id } = ctx.params;
    // 调用 Service 进行业务处理
    await service.feedback.destroy(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '删除反馈成功' });
  }

  /**
   * 批量删除反馈
   * 参数 {ids: "5a452a44ab122b16a0231b42,5a452a3bab122b16a0231b41"}
   */
  async destroyList() {
    const { ctx, service } = this;
    // 组装参数
    const { ids } = ctx.params;
    const params = ids.split(',') || [];
    // 调用 Service 进行业务处理
    await service.feedback.destroyList(params);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '批量删除反馈成功' });
  }

  /**
   * 获取单个反馈
   */
  async show() {
    const { ctx, service } = this;
    // 组装参数
    const { id } = ctx.params;
    // 调用 Service 进行业务处理
    const role = await service.feedback.show(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '获取反馈成功', data: role });
  }

  /**
   * 查询所有反馈(分页)
   */
  async index() {
    const { ctx, service } = this;
    // 组装参数
    const params = ctx.params.permit('page', 'limit', 'contact');
    // 调用 Service 进行业务处理
    const roles = await service.feedback.index(params);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '查询反馈成功', data: roles });
  }

}


module.exports = FeedbackController;
