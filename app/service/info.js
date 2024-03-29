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
  async updateAvatar(stream) {
    const { ctx, service } = this;
    // 调用通用上传方法
    const params = await service.attachment.upload(stream);
    const attachment = await service.attachment.create(params);

    // 查询用户信息
    const id = ctx.state.user.id;
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
  async updateCover(stream) {
    const { ctx, service } = this;
    // 调用通用上传方法
    const params = await service.attachment.upload(stream);
    const attachment = await service.attachment.create(params);

    // 更新用户头像
    const id = ctx.state.user.id;
    // 更新用户信息并返回
    return service.user.findByIdAndUpdate(id, { cover: attachment.path });
  }

  /**
   * 绑定邮箱
   */
  async bindEmail(params) {
    const { ctx, service } = this;
    const id = ctx.state.user.id;
    const user = await service.user.find(id);
    if (!user) {
      ctx.throw(404, `用户不存在 ${id}`);
    }
    const code = await service.code.findByEmail(params.email);
    if (!code || code.code !== params.code) {
      ctx.throw(404, `验证码不存在或已失效 ${code}`);
    }
    service.code.destroy(code.id);

    return service.user.findByIdAndUpdate(id, { email: params.email, emailVerify: true });
  }

  /**
   * 重置密码
   * @param params
   */
  async updatePassword(params) {
    const { app, ctx, service } = this;

    const code = await service.code.findByEmail(params.email);
    if (!code || code._doc.code !== params.code) {
      ctx.throw(404, '验证码不存在或已失效');
    }
    service.code.destroy(code.id);

    const id = ctx.state.user.id;
    const user = await service.user.find(id);
    if (!user) {
      ctx.throw(404, `用户不存在 ${id}`);
    }
    // 密码加密，这里是简单的 md5 加密
    user.password = await ctx.helper.cryptoMD5(params.password);
    // 修改密码需要清除 token 重新登录认证
    user.token = service.token.create(user);

    if (app.config.easemob.enable) {
      const result = await service.third.easemob.updatePassword(id, user.password);
      if (result !== 0) {
        ctx.throw(result, '密码更新失败，请稍后重试');
      }
    }

    return service.user.findByIdAndUpdate(id, user);
  }

  /**
   * 个人信息认证
   * TODO 这里只是根据正则校验下身份证号格式，并没有联网真是的身份信息，正式上线需要做数据查询对比
   */
  async realAuth(params) {
    const { ctx, service } = this;
    const id = ctx.state.user.id;
    const authResult = await service.third.auth.realAuth(params.idCardNumber, params.realName);
    if (authResult && authResult.status === 200 && authResult.data && authResult.data.code === 0) {
      // 调用 Service 进行业务处理
      return await service.user.update(id, params);
    }
    const code = authResult.data.code;
    const desc = authResult.data.desc;
    // const code = authResult.res.status;
    // const desc = authResult.res.statusMessage;
    ctx.throw(412, `实名认证失败 ${code}-${desc} ，请检查身份证号和姓名`);
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
      .populate('profession', { title: 1 })
      .populate('role', { title: 1, identity: 1 })
      .exec();
    if (!user) {
      ctx.throw(404, `用户不存在 ${id}`);
    }
    // 查询与用户的关系
    user._doc.relation = await service.relation.relation(id);

    // 查询与用户拉黑状态

    user._doc.blacklist = await service.blacklist.relation(id);
    return user;
  }

  /**
   * 获取指定集合用户信息
   */
  async userList(ids, userSelect) {
    const { ctx } = this;
    // const user = await service.user.find(id, userSelect);
    const query = { _id: { $in: ids } };
    const users = await ctx.model.User.find(query, userSelect)
      .populate('profession', { title: 1 })
      .populate('role', { title: 1, identity: 1 })
      .exec();
    if (!users) {
      ctx.throw(404, `用户不存在 ${ids}`);
    }

    return users;
  }

}

module.exports = SignService;
