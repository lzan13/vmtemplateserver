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
    // 先判断下权限
    const identity = ctx.state.user.identity;
    if (identity < 700) {
      ctx.throw(403, '无权操作');
    }
    const code = await service.code.find(id);
    if (!code) {
      ctx.throw(404, `验证码不存在 ${id}`);
    }
    return ctx.model.Code.findByIdAndRemove(id);
  }

  /**
   * 批量删除
   * @param ids 需要删除的 Id 集合
   */
  async destroyList(ids) {
    const { ctx } = this;
    const identity = ctx.state.user.identity;
    if (identity < 700) {
      ctx.throw(403, '无权操作，请联系管理员开通权限');
    }
    return ctx.model.Code.remove({ _id: { $in: ids } });
  }
  /**
   * 获取列表，可根据参数判断是否分页，搜索
   * @param params 查询参数
   */
  async index(params) {
    const { ctx } = this;
    const { page, limit } = params;
    let result = [];
    let currentCount = 0;
    let totalCount = 0;
    // 计算分页
    const skip = Number(page || 0) * Number(limit || 20);
    // 组装查询参数
    const query = {};

    result = await ctx.model.Code.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .exec();
    currentCount = result.length;
    totalCount = await ctx.model.Code.countDocuments(query).exec();

    // 整理数据源 -> Ant Design Pro
    const data = result.map(item => {
      const json = Object.assign({}, item._doc);
      return json;
    });

    return { currentCount, totalCount, page: Number(page), limit: Number(limit), data };
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

  /**
   * 删除数据
   */
  async findOneAndRemove(query) {
    return this.ctx.model.Code.findOneAndRemove(query);
  }

}

module.exports = CodeService;
