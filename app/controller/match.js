/**
 * Create by lzan13 2020/7/7
 * 描述：匹配数据对外接口
 */
'use strict';

const Controller = require('egg').Controller;

class MatchController extends Controller {

  /**
   * 创建
   */
  async create() {
    const { ctx, service } = this;
    const params = ctx.params.permit('content', 'emotion', 'type');
    // 调用 Service 进行业务处理
    let match = await service.match.create(params);
    // 这里查询下包括用户信息
    match = await service.match.find(match.id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '提交成功', data: match });
  }

  /**
   * 删除
   */
  async destroy() {
    const { ctx, service } = this;
    // 校验参数
    const { id } = ctx.params;
    // 调用 Service 进行业务处理
    await service.match.destroy(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '删除数据成功' });
  }

  /**
   * 随机获取一条数据
   */
  async one() {
    const { ctx, service } = this;
    const { type } = ctx.params;
    const match = await service.match.match(type);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '获取成功', data: match });
  }

  /**
   * 查询所有数据(分页/模糊)
   */
  async index() {
    const { ctx, service } = this;
    // 组装参数
    const params = ctx.params.permit('page', 'limit', 'type');
    // 调用 Service 进行业务处理
    const likes = await service.match.index(params);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '查询信息成功', data: likes });
  }

}


module.exports = MatchController;
