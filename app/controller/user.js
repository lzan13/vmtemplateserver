/**
 * Create by lzan13 2020/7/6
 * 描述：用户控制类
 */
'use strict';
const Controller = require('egg').Controller;

class UserController extends Controller {

  /**
   * 创建用户
   */
  async create() {
    const { ctx, service } = this;

    // 组装参数
    const params = ctx.params.permit('phone', 'email', 'password', 'devicesId');
    // 校验参数
    ctx.validate({ phone: 'phone', email: 'email', password: 'password', devicesId: 'string' }, params);

    // 调用 Service 进行业务处理
    const data = await service.user.create(params);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '创建用户成功', data });
  }

  /**
   * 销毁用户，这里操作是物理删除，从数据库删除用户全部信息
   */
  async destroy() {
    const { ctx, service } = this;
    // 校验参数
    const { id } = ctx.params;
    // 调用 Service 进行业务处理
    await service.user.destroy(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '销毁用户成功' });
  }

  /**
   * 批量销毁用户，参数为 Id 集合，这里的销毁是物理删除，从数据库删除用户全部信息
   */
  async destroyList() {
    const { ctx, service } = this;
    // 组装参数
    const { ids } = ctx.params;
    const idArray = ids.split(',') || [];
    for (const id of idArray) {
      // 调用 Service 进行业务处理
      await service.user.destroy(id);
    }
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '批量销毁用户成功' });
  }

  /**
   * 删除用户，这里是软删除，将用户状态改为删除
   * 参数为 {id:xxxxx,reason:'删除理由'}
   */
  async delete() {
    const { ctx, service } = this;
    // 组装参数
    const params = ctx.params;
    // 调用 Service 进行业务处理
    await service.user.delete(params.id, params.reason);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '删除用户成功' });
  }

  /**
   * 批量软删除用户
   * 参数为 {ids:'xxxxx,xxxxx',reason:'删除理由'}
   */
  async deleteList() {
    const { ctx, service } = this;
    const { ids, reason } = ctx.params;
    const idArray = ids.split(',') || [];
    // 设置响应内容和响应状态码
    for (const id of idArray) {
      // 调用 Service 进行业务处理
      await service.user.delete(id, reason);
    }
    ctx.helper.success({ ctx, msg: '批量删除用户成功' });
  }

  /**
   * 修改用户信息
   */
  async update() {
    const { ctx, service } = this;

    // 组装参数
    const { id } = ctx.params;
    // 组装参数
    const params = ctx.params.permit(
      'devicesId',
      'phone',
      'email',
      'password',
      'avatar',
      'cover',
      'birthday',
      'gender',
      'nickname',
      'signature',
      'address',
      'hobby',
      'clockContinuousCount',
      'clockTotalCount',
      'clockTime',
      'fansCount',
      'followCount',
      'likeCount',
      'postCount',
      'profession',
      'idCardNumber',
      'realName',
      'deleted',
      'deletedReason'
    );
    // 校验参数
    ctx.validate({
      devicesId: 'string?',
      username: 'username?',
      phone: 'phone?',
      email: 'email?',
      password: 'password?',
      avatar: 'string?',
      cover: 'string?',
      birthday: 'birthday?',
      gender: 'gender?',
      nickname: 'nickname?',
      signature: 'signature?',
      address: 'address?',
      hobby: 'hobby?',
      idCardNumber: 'idCardNumber?',
      realName: 'string?',
    }, params);

    // 调用 Service 进行业务处理
    await service.user.update(id, params);
    const user = await service.user.show(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '更新用户成功', data: user });
  }

  /**
   * 更新用户角色信息，只有管理员才能操作
   */
  async updateRole() {
    const { ctx, service } = this;
    const params = ctx.params.permit('id', 'roleId');
    const user = await service.user.find(params.id);
    if (!user) {
      ctx.throw(404, '用户不存在');
    }
    const role = await service.role.find(params.roleId);
    if (!role) {
      ctx.throw(404, '角色不存在');
    }
    // 更新用户信息
    await service.user.findByIdAndUpdate(params.id, { role: role._id });

    user.role = role;
    ctx.helper.success({ ctx, msg: '更新用户角色成功', data: user });
  }

  /**
   * 获取单个用户
   */
  async show() {
    const { ctx, service } = this;
    // 组装参数
    const { id } = ctx.params;
    // 调用 Service 进行业务处理
    const user = await service.user.show(id);
    // 只有登录接口会返回 token，其他接口要置空
    user.token = '';
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '获取用户成功', data: user });
  }

  /**
   * 查询所有用户(分页/模糊)
   */
  async index() {
    const { ctx, service } = this;
    // 组装参数
    const params = ctx.params;
    // 调用 Service 进行业务处理
    const users = await service.user.index(params);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '查询用户成功', data: users });
  }

}

module.exports = UserController;
