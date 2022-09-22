/**
 * Create by lzan13 2021/7/2
 * 描述：版本信息处理服务
 */
'use strict';

const Service = require('egg').Service;

class VersionService extends Service {

  /**
   * 新增版本
   */
  async create(params) {
    const { ctx } = this;
    return await ctx.model.Version.create(params);
  }

  /**
   * 删除一个版本
   */
  async destroy(id) {
    const { ctx, service } = this;
    // 先判断下权限
    const identity = ctx.state.user.identity;
    if (identity < 700) {
      ctx.throw(403, '无权操作');
    }
    const version = await service.version.find(id);
    if (!version) {
      ctx.throw(404, `版本不存在 ${id}`);
    }
    return ctx.model.Version.findByIdAndRemove(id);
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
    return ctx.model.Version.remove({ _id: { $in: ids } });
  }
  /**
   * 更新版本
   * @param id
   * @param params
   */
  async update(id, params) {
    const { ctx, service } = this;
    const version = await service.version.find(id);
    if (!version) {
      ctx.throw(404, `版本不存在 ${id}`);
    }
    return await service.version.findByIdAndUpdate(id, params);
  }

  /**
   * 获取一个版本
   * @param id
   */
  async show(id) {
    const { ctx, service } = this;
    const version = await service.version.find(id);
    if (!version) {
      ctx.throw(404, `版本不存在 ${id}`);
    }
    return version;
  }

  /**
   * 获取版本列表，可根据参数判断是否分页，搜索
   * @param params 查询参数
   */
  async index(params) {
    const { ctx } = this;
    const { page, limit, platform } = params;
    let result = [];
    let currentCount = 0;
    let totalCount = 0;
    // 计算分页
    const skip = Number(page || 0) * Number(limit || 20);
    // 组装查询参数
    const query = {};
    if (platform) {
      query.platform = platform;
    }

    result = await ctx.model.Version.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .exec();
    currentCount = result.length;
    totalCount = await ctx.model.Version.countDocuments(query).exec();

    // 整理数据源 -> Ant Design Pro
    const data = result.map(item => {
      const json = Object.assign({}, item._doc);
      // 格式化一下返回给客户端的时间戳样式
      // json.createdAt = ctx.helper.formatTime(item.createdAt);
      // json.updatedAt = ctx.helper.formatTime(item.updatedAt);
      return json;
    });

    return { currentCount, totalCount, page: Number(page), limit: Number(limit), data };
  }

  /**
   * ===================================================================================
   * 通用方法，主要是这些方法有多个地方调用，简单封装下
   */
  /**
   * 通过 Id 查找一个版本
   */
  async find(id) {
    return this.ctx.model.Version.findById(id);
  }

  /**
   * 通过平台查找一个版本
   */
  async findByPlatform(platform) {
    return this.ctx.model.Version.findOne({ platform });
  }


  /**
   * 更新配置信息
   * @param id
   * @param params 需要更新的信息
   */
  async findByIdAndUpdate(id, params) {
    return this.ctx.model.Version.findByIdAndUpdate(id, params, { new: true });
  }
}

module.exports = VersionService;
