/**
 * Create by lzan13 2020/7/7
 * 描述：内容对外接口
 */
'use strict';

const Controller = require('egg').Controller;

class PostController extends Controller {

  /**
   * 发布内容
   */
  async create() {
    const { ctx, service } = this;
    // 组装参数
    const params = ctx.params.permit('title', 'content', 'category', 'attachments', 'stick', 'extension');
    // 校验参数
    ctx.validate({ title: 'title', content: 'content', extension: 'string?' }, params);

    // 调用 Service 进行业务处理
    await service.post.create(params);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '发布成功' });
  }

  /**
   * 销毁
   */
  async destroy() {
    const { ctx, service } = this;
    // 校验参数
    const { id } = ctx.params;
    // 调用 Service 进行业务处理
    await service.post.destroy(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '销毁成功' });
  }

  /**
   * 批量销毁
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
      await service.post.destroy(id);
    }
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '批量销毁成功' });
  }

  /**
   * 删除内容，这里是软删除，将内容状态改为删除
   * 参数为 {id:xxxxx,reason:'删除理由'}
   */
  async delete() {
    const { ctx, service } = this;
    // 组装参数
    const { id } = ctx.params;
    // 调用 Service 进行业务处理
    await service.post.delete(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '删除内容成功' });
  }

  /**
   * 批量软删除内容
   * 参数为 {ids:'xxxxx,xxxxx',reason:'删除理由'}
   */
  async deleteList() {
    const { ctx, service } = this;
    const { ids } = ctx.params;
    const idArray = ids.split(',') || [];
    // 设置响应内容和响应状态码
    for (const id of idArray) {
      // 调用 Service 进行业务处理
      await service.post.delete(id);
    }
    ctx.helper.success({ ctx, msg: '批量删除内容成功' });
  }

  /**
   * 修改内容
   */
  async update() {
    const { ctx, service } = this;
    // 组装参数
    const { id } = ctx.params;
    // 组装参数
    const params = ctx.params.permit('title', 'content', 'stick', 'category', 'extension');
    // 校验参数
    ctx.validate({ title: 'title', content: 'content', stick: 'int?', extension: 'string?' }, params);

    // 调用 Service 进行业务处理
    await service.post.update(id, params);
    const post = service.post.find(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '更新内容成功', data: post });
  }

  // 获取单个内容
  async show() {
    const { ctx, service } = this;
    // 组装参数
    const { id } = ctx.params;
    // 调用 Service 进行业务处理
    const post = await service.post.show(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '获取内容成功', data: post });
  }

  /**
   * 查询所有内容(分页/模糊)
   */
  async index() {
    const { ctx, service } = this;
    // 组装参数
    const params = ctx.params;
    // 调用 Service 进行业务处理
    const posts = await service.post.index(params);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '查询内容成功', data: posts });
  }

}


module.exports = PostController;
