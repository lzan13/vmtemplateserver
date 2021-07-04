/**
 * Create by lzan13 2021/7/2
 * 描述：验证码信息处理服务
 */
'use strict';

const Service = require('egg').Service;

class CodeService extends Service {

  /**
   * 新增验证码
   */
  async create(params) {
    const { ctx } = this;
    return await ctx.model.Code.create(params);
  }

  /**
   * 删除一个验证码
   * @param id
   */
  async destroy(id) {
    const { ctx, service } = this;
    const code = await service.code.find(id);
    if (!code) {
      ctx.throw(404, `验证码不存在 ${id}`);
    }
    return ctx.model.Code.findByIdAndRemove(id);
  }

  /**
   * ===================================================================================
   * 通用方法，主要是这些方法有多个地方调用，简单封装下
   */
  /**
   * 通过 Id 查找一个验证码
   * @param id
   */
  async find(id) {
    return this.ctx.model.Code.findById(id);
  }

  /**
   * 通过手机号查找一个验证码
   */
  async findByPhone(phone) {
    return this.ctx.model.Code.findOne({ phone });
  }

  /**
   * 通过邮箱查找一个验证码
   */
  async findByEmail(email) {
    return this.ctx.model.Code.findOne({ email });
  }

}

module.exports = CodeService;
