/**
 * Create by lzan13 2020/7/7
 * 描述：喜欢对外接口
 */
'use strict';

const Controller = require('egg').Controller;

class LikeController extends Controller {

  /**
   * 喜欢
   */
  async create() {
    const { ctx, service } = this;
    // 组装参数
    const params = ctx.params.permit('type', 'id');
    // 调用 Service 进行业务处理
    await service.like.create(params.type, params.id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '喜欢成功' });
  }

  /**
   * 取消喜欢
   */
  async destroy() {
    const { ctx, service } = this;
    // 校验参数
    const params = ctx.params.permit('type', 'id');
    // 调用 Service 进行业务处理
    await service.like.destroy(params.type, params.id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '取消喜欢成功' });
  }

  /**
   * 查询所有喜欢(分页/模糊)
   * @param type 查询类型 0-用户 1-帖子 2-评论
   * @param owner 查询指定用户喜欢的内容
   * @param id 查询指定类型的 id
   */
  async index() {
    const { ctx, service } = this;
    // 组装参数
    const params = ctx.params.permit('page', 'limit', 'type', 'owner', 'id');
    // 调用 Service 进行业务处理
    const likes = await service.like.index(params);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '查询喜欢信息成功', data: likes });
  }

}


module.exports = LikeController;
