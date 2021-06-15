/**
 * Create by lzan13 2020/7/13
 * 描述：用户信息等操作处理服务
 */
'use strict';

const Service = require('egg').Service;

class SignService extends Service {

  /**
   * 修改个人信息
   * @param params
   */
  async updateInfo(params) {
    const { ctx, service } = this;
    // 获取当前用户
    const id = ctx.state.user.id;
    const user = await service.user.find(id);
    if (!user) {
      ctx.throw(404, `用户不存在 ${id}`);
    }
    return service.user.findByIdAndUpdate(id, params);
  }

  /**
   * 更新绑定 username
   */
  async updateUsername(params) {
    const { ctx, service } = this;
    const id = ctx.state.user.id;
    let user = await service.user.find(id);
    if (user && user.username) {
      ctx.throw(403, 'username 只能设置一次');
    }
    user = await service.user.findByQuery({ username: params.username });
    if (user) {
      ctx.throw(409, 'username 已存在');
    }
    // 调用 Service 进行业务处理
    return service.user.findByIdAndUpdate(id, params);
  }

  /**
   * 更新头像
   *
   * @param stream 文件数据了
   * @param filename 文件名
   * @param extname 文件后缀
   */
  async updateAvatar(stream, filename, extname) {
    const { ctx, service } = this;
    // 调用通用上传方法
    const params = await service.attachment.upload(stream, filename, extname);
    const attachment = await service.attachment.create(params);

    // 更新用户头像
    const id = ctx.state.user.id;
    const user = await service.user.find(id);
    if (!user) {
      ctx.throw(404, `用户不存在 ${id}`);
    }
    // 更新用户信息并返回
    return service.user.findByIdAndUpdate(id, { avatar: attachment.path });
  }

  /**
   * 更新头像
   *
   * @param {Stream}stream 文件数据了
   * @param {String}filename 文件名
   * @param {String}extname 文件后缀
   */
  async updateCover(stream, filename, extname) {
    const { ctx, service } = this;
    // 调用通用上传方法
    const params = await service.attachment.upload(stream, filename, extname);
    const attachment = await service.attachment.create(params);

    // 更新用户头像
    const id = ctx.state.user.id;
    const user = await service.user.find(id);
    if (!user) {
      ctx.throw(404, `用户不存在 ${id}`);
    }
    // 更新用户信息并返回
    return service.user.findByIdAndUpdate(id, { cover: attachment.path });
  }

  /**
   * 重置密码
   * @param params
   */
  async updatePassword(password, oldPassword) {
    const { ctx, service } = this;
    const id = ctx.state.user.id;
    const user = await service.user.find(id);
    if (!user) {
      ctx.throw(404, `用户不存在 ${id}`);
    }

    if (user.password !== ctx.helper.cryptoMD5(oldPassword)) {
      ctx.throw(412, '原密码错误');
    }
    // 密码加密，这里是简单的 md5 加密
    user.password = await ctx.helper.cryptoMD5(password);
    // 修改密码需要清除 token 重新登录认证
    user.token = service.token.create(user);

    return service.user.findByIdAndUpdate(id, user);
  }

  /**
   * 个人信息认证
   * TODO 这里只是根据正则校验下身份证号格式，并没有联网真是的身份信息，正式上线需要做数据查询对比
   */
  async personalAuth(params) {
    const { ctx, service } = this;
    const id = ctx.state.user.id;
    // 调用 Service 进行业务处理
    return await service.user.update(id, params);
  }

  /**
   * 获取当前用户信息
   */
  async current() {
    const { ctx, service } = this;
    const id = ctx.state.user.id;
    const user = await service.user.find(id);
    if (!user) {
      ctx.throw(404, `用户不存在 ${id}`);
    }
    return user;
  }

  /**
   * 获取其他用户信息
   */
  async other(id, userSelect) {
    const { ctx, service } = this;
    // const user = await service.user.find(id, userSelect);
    const user = await ctx.model.User.findById(id, userSelect)
      .populate('profession', { title: 1, desc: 1 })
      .populate('role', { title: 1, desc: 1, identity: 1 })
      .exec();
    if (!user) {
      ctx.throw(404, `用户不存在 ${id}`);
    }
    // 查询与用户的关系
    const relation = await service.follow.relation(id);
    user._doc.relation = relation;
    return user;
  }

  /**
   * 获取指定集合用户信息
   */
  async userList(ids, userSelect) {
    const { ctx, service } = this;
    // const user = await service.user.find(id, userSelect);
    const query = { _id: { $in: ids } };
    const users = await ctx.model.User.find(query, userSelect)
      .populate('profession', { title: 1, desc: 1 })
      .populate('role', { title: 1, desc: 1, identity: 1 })
      .exec();
    if (!users) {
      ctx.throw(404, `用户不存在 ${ids}`);
    }

    return users;
  }

}

module.exports = SignService;
