/**
 * Create by lzan13 2020/7/7
 * 描述：职业对外接口
 */
'use strict';

const Controller = require('egg').Controller;

class ProfessionController extends Controller {

  /**
   * 创建职业
   */
  async create() {
    const { ctx, service } = this;
    // 组装参数
    const params = ctx.params.permit('title', 'desc');
    // 校验参数
    ctx.validate({ title: 'title', desc: 'desc' }, params);
    // 调用 Service 进行业务处理
    const profession = await service.profession.create(params);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '创建职业成功', data: profession });
  }

  /**
   * 删除职业
   */
  async destroy() {
    const { ctx, service } = this;
    // 校验参数
    const { id } = ctx.params;
    // 调用 Service 进行业务处理
    await service.profession.destroy(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '删除职业成功' });
  }

  /**
   * 批量删除职业
   * 参数 {ids: "5a452a44ab122b16a0231b42,5a452a3bab122b16a0231b41"}
   */
  async destroyList() {
    const { ctx, service } = this;
    // 组装参数
    const { ids } = ctx.params;
    const params = ids.split(',') || [];
    // 调用 Service 进行业务处理
    await service.profession.destroyList(params);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '批量删除职业成功' });
  }

  /**
   * 修改职业
   */
  async update() {
    const { ctx, service } = this;
    // 校验参数
    ctx.validate(this.createParams);
    // 组装参数
    const { id } = ctx.params;
    // 组装参数
    const params = ctx.params.permit('title', 'desc');
    // 校验参数
    ctx.validate({ title: 'title', desc: 'desc' }, params);
    // 调用 Service 进行业务处理
    const profession = await service.profession.update(id, params);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '更新职业成功', data: profession });
  }

  // 获取单个职业
  async show() {
    const { ctx, service } = this;
    // 组装参数
    const { id } = ctx.params;
    // 调用 Service 进行业务处理
    const profession = await service.profession.show(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '获取职业成功', data: profession });
  }

  /**
   * 查询所有职业(分页/模糊)
   */
  async index() {
    const { ctx, service } = this;
    // 组装参数
    const params = ctx.params;
    // 调用 Service 进行业务处理
    const professions = await service.profession.index(params);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '查询职业成功', data: professions });
  }

}


module.exports = ProfessionController;
