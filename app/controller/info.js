/**
 * Create by lzan13 2020/7/6
 * 描述：登录注册接口
 */
'use strict';
const path = require('path');
const Controller = require('egg').Controller;
const userSelect = {
  devicesId: 0,
  email: 0,
  emailVerify: 0,
  phone: 0,
  phoneVerify: 0,
  password: 0,
  token: 0,
  code: 0,
  idCardNumber: 0,
  realName: 0,
  deleted: 0,
  deletedReason: 0,
  deletedAt: 0,
  createdAt: 0,
  updatedAt: 0,
};

class SignController extends Controller {

  /**
   * 修改基础信息
   */
  async updateInfo() {
    const { ctx, service } = this;
    // 组装参数
    const params = ctx.params.permit('birthday', 'gender', 'nickname', 'signature', 'address', 'hobby', 'profession');
    // 参数校验
    ctx.validate({
      birthday: 'birthday?',
      gender: 'gender?',
      nickname: 'nickname?',
      signature: 'signature?',
      address: 'address?',
      hobby: 'string?',
    }, params);

    // 调用 Service 进行业务处理
    await service.info.updateInfo(params);
    // 查询最新数据
    const id = ctx.state.user.id;
    const user = await service.user.find(id, { password: 0 });
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '信息更新成功', data: user });
  }

  /**
   * 设置 username 只能修改一次
   */
  async updateUsername() {
    const { ctx, service } = this;
    // 组装参数
    const params = ctx.params.permit('username');
    // 校验参数
    ctx.validate({ username: 'username' }, params);

    // 调用 Service 进行业务处理
    await service.info.updateUsername(params);

    const id = ctx.state.user.id;
    const user = await service.user.find(id, { password: 0 });

    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '信息更新成功', data: user });
  }

  /**
   * 修改头像
   */
  async updateAvatar() {
    const { ctx, service } = this;
    // 通过 ctx.getFileStream 获取用户上传的文件
    const stream = await ctx.getFileStream();
    // 所有表单字段都能通过 `stream.fields` 获取到
    const filename = path.basename(stream.filename); // 文件名称
    const extname = path.extname(stream.filename).toLowerCase(); // 文件扩展名称
    await service.info.updateAvatar(stream, filename, extname);
    // 查询最新数据
    const id = ctx.state.user.id;
    const user = await service.user.find(id, { password: 0 });
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '更新头像成功', data: user });
  }

  /**
   * 修改封面
   */
  async updateCover() {
    const { ctx, service } = this;
    // 通过 ctx.getFileStream 获取用户上传的文件
    const stream = await ctx.getFileStream();
    // 所有表单字段都能通过 `stream.fields` 获取到
    const filename = path.basename(stream.filename); // 文件名称
    const extname = path.extname(stream.filename).toLowerCase(); // 文件扩展名称
    await service.info.updateCover(stream, filename, extname);
    // 查询最新数据
    const id = ctx.state.user.id;
    const user = await service.user.find(id, { password: 0 });
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '更新封面成功', data: user });
  }

  /**
   * 重置密码
   */
  async updatePassword() {
    const { ctx, service } = this;
    // 组装参数
    const params = ctx.params.permit('password', 'oldPassword');
    // 校验参数
    ctx.validate({ password: 'password', oldPassword: 'password' }, params);

    // 调用 Service 进行业务处理
    await service.info.updatePassword(params.password, params.oldPassword);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '密码修改成功，请用新密码重新登录' });
  }

  /**
   * 个人信息认证
   */
  async personalAuth() {
    const { ctx, service } = this;
    // 组装参数
    const params = ctx.params.permit('idCardNumber', 'realName');
    // 校验参数
    ctx.validate({ idCardNumber: 'idCardNumber', realName: 'string' }, params);

    // 调用 Service 进行业务处理
    await service.info.personalAuth(params);
    // 查询最新数据
    const id = ctx.state.user.id;
    const user = await service.user.find(id, { password: 0 });
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '实名认证信息提交成功', data: user });
  }

  /**
   * 获取当前用户信息
   */
  async current() {
    const { ctx, service } = this;
    const user = await service.info.current();
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '获取用户成功', data: user });
  }

  /**
   * 获取其他用户信息
   */
  async other() {
    const { ctx, service } = this;
    const { id } = ctx.params.permit('id');
    const user = await service.info.other(id, userSelect);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '获取用户成功', data: user });
  }

  /**
   * 获取指定集合用户信息
   */
  async userList() {
    const { ctx, service } = this;
    const { ids } = ctx.params.permit('ids');
    const users = await service.info.userList(ids, userSelect);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '获取用户成功', data: users });
  }

  /**
   * 签到
   */
  async clock() {
    const { ctx, service } = this;
    const id = ctx.state.user.id;
    await service.clock.create(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '签到成功' });
  }

  /**
   * 获取分类列表
   */
  async category() {
    const { ctx, service } = this;
    // 组装参数
    const params = ctx.params;
    // 调用 Service 进行业务处理
    const categorys = await service.category.index(params);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '查询分类成功', data: categorys });
  }

  /**
   * 获取职业列表
   */
  async profession() {
    const { ctx, service } = this;
    // 组装参数
    const params = ctx.params;
    // 调用 Service 进行业务处理
    const professions = await service.profession.index(params);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '查询职业成功', data: professions });
  }

}

module.exports = SignController;
