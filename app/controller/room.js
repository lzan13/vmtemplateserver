/**
 * Create by lzan13 2020/7/7
 * 描述：房间对外接口
 */
'use strict';

const Controller = require('egg').Controller;

class RoomController extends Controller {

  /**
   * 创建
   */
  async create() {
    const { ctx, service } = this;
    // 组装参数
    const params = ctx.params.permit('title', 'desc', 'owner');
    // 校验参数
    ctx.validate({ title: 'title', desc: 'desc' }, params);

    // 调用 Service 进行业务处理
    const room = await service.room.create(params);

    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '创建成功', data: room });
  }

  /**
   * 销毁
   */
  async destroy() {
    const { ctx, service } = this;
    // 校验参数
    const { id } = ctx.params;
    // 调用 Service 进行业务处理
    await service.room.destroy(id);
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
      await service.room.destroy(id);
    }
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '批量销毁成功' });
  }

  /**
   * 修改
   */
  async update() {
    const { ctx, service } = this;
    // 组装参数
    const { id } = ctx.params;
    // 组装参数
    const params = ctx.params.permit('title', 'desc');
    // 校验参数
    ctx.validate({ title: 'title', desc: 'desc' }, params);

    // 调用 Service 进行业务处理
    await service.room.update(id, params);
    const room = service.room.find(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '更新成功', data: room });
  }

  // 获取单个内容
  async show() {
    const { ctx, service } = this;
    // 组装参数
    const { id } = ctx.params;
    // 调用 Service 进行业务处理
    const room = await service.room.show(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '获取成功', data: room });
  }

  /**
   * 查询所有房间(分页/模糊)
   */
  async index() {
    const { ctx, service } = this;
    // 组装参数
    const params = ctx.params;
    // 调用 Service 进行业务处理
    const rooms = await service.room.index(params);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '查询成功', data: rooms });
  }

}


module.exports = RoomController;
