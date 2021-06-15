/**
 * Create by lzan13 2020/07/06.
 * 描述：JWT token 生成服务
 */
'use strict';

const Service = require('egg').Service;

class TokenService extends Service {
  /**
   * 生成 token
   * @param {Object} params 生成 token 所包含的数据
   */
  async create(user) {
    const { app } = this;
    // 在 token 中保存一些后边会用到的信息
    const params = {
      id: user.id,
      devicesId: user.devicesId,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      identity: user.role.identity,
    };

    return app.jwt.sign({
      data: params,
      // 测试状态设置 token 有效期为 2 分钟
      // exp: Math.floor(Date.now() / 1000) + (60 * 2),
      // exp: Math.floor(Date.now() / 1000) + (60 * 60),
      // 设置 token 有效期为 30 天
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30),
    }, app.config.jwt.secret);
  }

  /**
   * 验证token的合法性
   * @param {String} token
   */
  async verify(token) {
    const { app } = this;
    try {
      const result = await app.jwt.verify(token, app.config.jwt.secret);
      result.verify = true;
      return result;
    } catch (e) {
      return { verify: false, message: 'Token 校验失败，请进行登录认证' };
    }
  }
}

module.exports = TokenService;
