/**
 * Create by lzan13 2020/7/13
 * 描述：个人账户注册登录等操作处理服务
 */
'use strict';

const Service = require('egg').Service;

class SignService extends Service {

  /**
   * 通过设备 id 注册
   */
  async signUpByDevicesId(params) {
    const { ctx, service } = this;
    let user = await service.user.findByDevicesId(params.devicesId);
    if (user) {
      ctx.throw(409, '同一个设备只能注册一个账户');
    }
    user = await service.user.create(params);
    // 创建成功查询下，主要是为了让结果包含角色信息
    user = await service.user.find(user._id);
    // 生成Token令牌
    user.token = await service.token.create(user);
    // 更新下用户信息，主要是把用户 token 保存到数据库
    await service.user.findByIdAndUpdate(user.id, user);
    return user;
  }

  /**
   * 通过邮箱注册
   */
  async signUpByEmail(params) {
    const { app, ctx, service } = this;
    let user = await service.user.findByDevicesId(params.devicesId);
    if (user) {
      ctx.throw(409, '同一个设备只能注册一个账户');
    }
    user = await service.user.findByEmail(params.email);
    if (user) {
      ctx.throw(409, '用户已存在');
    }
    // 创建账户
    user = await service.user.create(params);
    // 创建成功查询下，主要是为了让结果包含角色信息
    user = await service.user.find(user._id);

    // 生成Token令牌
    user.token = await service.token.create(user);
    // 更新下用户信息，主要是把用户 token 保存到数据库
    await service.user.findByIdAndUpdate(user.id, user);

    // TODO 邮箱注册成功，发送验证邮件，需要新建验证码表存储验证码信息
    if (app.config.isNeedActivate) {
      const code = ctx.helper.authCode();
      await service.mail.sendVerify(params.email, code);
    }
    return user;
  }

  /**
   * 通过手机号注册
   */
  async signUpByPhone(params) {
    const { ctx, service } = this;
    let user = await service.user.findByDevicesId(params.devicesId);
    if (user) {
      ctx.throw(409, '同一个设备只能注册一个账户');
    }
    user = await service.user.findByPhone(params.phone);
    if (user) {
      ctx.throw(409, '用户已存在');
    }
    user = await service.user.create(params);
    // 创建成功查询下，主要是为了让结果包含角色信息
    user = await service.user.find(user._id);

    // 生成Token令牌
    user.token = await service.token.create(user);
    // 更新下用户信息，主要是把用户 token 保存到数据库
    await service.user.findByIdAndUpdate(user.id, user);
    return user;
  }

  /**
   * 通用登录，内部会查询 username phone email 三种情况
   */
  async signIn(params) {
    const { ctx, service } = this;
    const user = await service.user.findByQuery({ $or: [{ devicesId: params.account }, { username: params.account }, { email: params.account }, { phone: params.account }] });
    if (!user) {
      ctx.throw(404, `用户不存在 ${params.account}`);
    }
    // 校验密码
    if (user.password !== ctx.helper.cryptoMD5(params.password)) {
      ctx.throw(412, '密码错误');
    }
    // 校验账户状态
    if (user.deleted > 0) {
      ctx.throw(410, user.deletedReason);
    }
    // if (params.account === user.email && !user.emailVerify) {
    //   ctx.throw(533, '邮箱还未认证，无法登陆');
    // }
    // 生成Token令牌
    user.token = await service.token.create(user);
    // 更新下用户信息，主要是把用户 token 保存到数据库
    await service.user.findByIdAndUpdate(user.id, user);
    return user;
  }

  /**
   * 通过验证码登录
   */
  async signInByCode(params) {
    const { ctx, service } = this;
    const user = await service.user.findByPhone(params.phone);
    if (!user) {
      ctx.throw(404, `用户不存在 ${params.phone}`);
    }
    // TODO 校验密码，需要新建验证码表存储验证码信息
    // if (user.code !== params.code) {
    //   ctx.throw(412, '无效验证码');
    // }
    // 校验账户状态
    if (user.deleted > 0) {
      ctx.throw(410, user.deletedReason);
    }

    // 生成Token令牌
    user.token = await service.token.create(user);
    // 更新下用户信息，主要是把用户 token 保存到数据库
    await service.user.findByIdAndUpdate(user.id, user);
    return user;
  }

  /**
   * 发送激活邮件
   */
  async sendVerifyEmail(email) {
    const { ctx, service } = this;
    const user = await service.user.findByEmail(email);
    if (!user) {
      ctx.throw(404, `用户不存在 ${email}`);
    }
    const code = ctx.helper.authCode();
    await service.user.findByIdAndUpdate(user.id, { code });

    return service.mail.sendVerify(email, code);
  }

  /**
   * 发送验证码邮件
   */
  async sendCodeEmail(email) {
    const { ctx, service } = this;
    const user = await service.user.findByEmail(email);
    if (!user) {
      ctx.throw(404, `用户不存在 ${email}`);
    }
    const code = ctx.helper.authCode();
    await service.user.findByIdAndUpdate(user.id, { code });

    return service.mail.sendCode(email, code);
  }

  /**
   * 账户激活
   */
  async activate(verify) {
    const { ctx, service } = this;
    const params = JSON.parse(ctx.helper.base64ToStr(verify));
    const user = await service.user.findByEmail(params.email);
    if (!user) {
      ctx.throw(404, `用户不存在 ${params.email}`);
    }
    if (params.code !== user.code) {
      ctx.throw(412, '激活码已失效');
    }
    const role = await service.role.findByIdentity(9);
    if (!role) {
      ctx.throw(404, '角色信息有误，请联系管理员');
    }
    return service.user.findByIdAndUpdate(user.id, { code: '', role: role.id });
  }

  /**
   * 退出登录
   */
  async signOut() {
    const { ctx, service } = this;
    const id = ctx.state.user.data.id;
    return service.user.findByIdAndUpdate(id, { token: '' });
  }

  /**
   * 销毁账户
   */
  async destroy() {
    const { ctx, service } = this;
    const id = ctx.state.user.data.id;
    return service.user.findByIdAndUpdate(id, { deleted: 0, deletedReason: '用户主动销户' });
  }
}

module.exports = SignService;
