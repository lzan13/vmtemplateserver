/**
 * Create by lzan13 2020/7/7
 * 描述：评论对外接口
 */
'use strict';

const Controller = require('egg').Controller;

class CommentController extends Controller {

  /**
   * 创建评论
   */
  async create() {
    const { ctx, service } = this;
    // 组装参数
    const params = ctx.params.permit('content', 'post', 'user');
    // 校验参数
    ctx.validate({ content: 'content', post: 'string?', user: 'string?' }, params);

    // 调用 Service 进行业务处理
    await service.comment.create(params);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '创建评论成功' });
  }

  /**
   * 删除评论
   */
  async destroy() {
    const { ctx, service } = this;
    // 校验参数
    const { id } = ctx.params;
    // 调用 Service 进行业务处理
    await service.comment.destroy(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '删除评论成功' });
  }

  /**
   * 批量删除评论
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
      await service.comment.destroy(id);
    }
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '批量删除评论成功' });
  }

  /**
   * 获取单个评论
   */
  async show() {
    const { ctx, service } = this;
    // 组装参数
    const { id } = ctx.params;
    // 调用 Service 进行业务处理
    const comment = await service.comment.show(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '获取评论成功', data: comment });
  }

  /**
   * 查询所有评论(分页/模糊)
   */
  async index() {
    const { ctx, service } = this;
    // 组装参数
    const params = ctx.params;
    // 调用 Service 进行业务处理
    const comments = await service.comment.index(params);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '查询评论成功', data: comments });
  }

}


module.exports = CommentController;
