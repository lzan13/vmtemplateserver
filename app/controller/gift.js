/**
 * Create by lzan13 2020/7/7
 * 描述：礼物对外接口
 */
'use strict';

const Controller = require('egg').Controller;

class GiftController extends Controller {

  /**
   * 新建
   */
  async create() {
    const { ctx, service } = this;
    // 组装参数
    const params = ctx.params.permit('title', 'desc', 'price', 'cover', 'animation', 'status', 'type');
    // 校验参数
    ctx.validate({ title: 'title', desc: 'desc' }, params);

    // 调用 Service 进行业务处理
    const gift = await service.gift.create(params);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '创建成功', data: gift });
  }

  /**
   * 销毁
   */
  async destroy() {
    const { ctx, service } = this;
    // 校验参数
    const { id } = ctx.params;
    // 调用 Service 进行业务处理
    await service.gift.destroy(id);
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
      await service.gift.destroy(id);
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
    const params = ctx.params.permit('title', 'desc', 'price', 'cover', 'animation', 'status', 'type');
    // 校验参数
    ctx.validate({ title: 'title', desc: 'desc?' }, params);

    // 调用 Service 进行业务处理
    await service.gift.update(id, params);
    const gift = service.gift.find(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '更新内容成功', data: gift });
  }

  /**
   * 赠送礼物
   */
  async give() {
    const { ctx, service } = this;
    // 组装参数
    const params = ctx.params.permit('userId', 'giftId', 'count');
    // 调用 Service 进行业务处理
    await service.gift.give(params);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '赠送成功' });
  }

  // 获取单个内容
  async show() {
    const { ctx, service } = this;
    // 组装参数
    const { id } = ctx.params;
    // 调用 Service 进行业务处理
    const gift = await service.gift.show(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '获取成功', data: gift });
  }

  /**
   * 查询所有内容(分页/模糊)
   */
  async index() {
    const { ctx, service } = this;
    // 组装参数
    const params = ctx.params.permit('status', 'page', 'limit');
    // 调用 Service 进行业务处理
    const gifts = await service.gift.index(params);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '查询成功', data: gifts });
  }

}


module.exports = GiftController;
