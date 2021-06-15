/**
 * Create by lzan13 2020/7/7
 * 描述：角色对外接口
 */
'use strict';

const Controller = require('egg').Controller;

class RoleController extends Controller {

  /**
   * 创建角色
   */
  async create() {
    const { ctx, service } = this;
    // 组装参数
    const params = ctx.params.permit('title', 'desc', 'identity');
    // 校验参数
    ctx.validate({ title: 'title', desc: 'desc', identity: 'int' }, params);
    // 调用 Service 进行业务处理
    const role = await service.role.create(params);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '创建角色成功', data: role });
  }

  /**
   * 删除角色
   */
  async destroy() {
    const { ctx, service } = this;
    // 校验参数
    const { id } = ctx.params;
    // 调用 Service 进行业务处理
    await service.role.destroy(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '删除角色成功' });
  }

  /**
   * 批量删除角色
   * 参数 {ids: "5a452a44ab122b16a0231b42,5a452a3bab122b16a0231b41"}
   */
  async destroyList() {
    const { ctx, service } = this;
    // 组装参数
    const { ids } = ctx.params;
    const params = ids.split(',') || [];
    // 调用 Service 进行业务处理
    await service.role.destroyList(params);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '批量删除角色成功' });
  }

  /**
   * 修改角色
   */
  async update() {
    const { ctx, service } = this;
    // 组装参数
    const { id } = ctx.params;
    // 组装参数
    const params = ctx.params.permit('title', 'desc', 'identity');
    // 校验参数
    ctx.validate({ title: 'title', desc: 'desc', identity: 'int' }, params);
    // 调用 Service 进行业务处理
    const role = await service.role.update(id, params);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '更新角色成功', data: role });
  }

  // 获取单个角色
  async show() {
    const { ctx, service } = this;
    // 组装参数
    const { id } = ctx.params;
    // 调用 Service 进行业务处理
    const role = await service.role.show(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '获取角色成功', data: role });
  }

  /**
   * 查询所有角色(分页/模糊)
   */
  async index() {
    const { ctx, service } = this;
    // 组装参数
    const params = ctx.params.permit('page', 'limit');
    // 调用 Service 进行业务处理
    const roles = await service.role.index(params);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '查询角色成功', data: roles });
  }

}


module.exports = RoleController;
