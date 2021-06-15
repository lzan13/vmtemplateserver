/**
 * Create by lzan13 2020/7/7
 * 描述：配置信息处理服务
 */
'use strict';

const Service = require('egg').Service;

class ConfigService extends Service {

  /**
   * 创建一个新配置
   * @param params
   */
  async create(params) {
    const { ctx, service } = this;
    const config = await service.config.findByAlias(params.alais);
    if (config) {
      ctx.throw(409, '配置已存在，请通过更新接口设置内容');
    }
    return this.ctx.model.Config.create(params);
  }

  /**
   * 删除一个配置信息
   * @param id
   */
  async destroy(id) {
    const { ctx, service } = this;
    const config = await service.config.find(id);
    if (!config) {
      ctx.throw(404, `配置信息不存在 ${id}`);
    }
    return ctx.model.Config.findByIdAndRemove(id);
  }

  /**
   * 更新配置
   * @param id
   * @param params
   */
  async update(id, params) {
    const { ctx, service } = this;
    const config = await service.config.find(id);
    if (!config) {
      ctx.throw(404, `配置信息不存在 ${id}`);
    }
    const temp = await service.config.findByAlias(params.title);
    // 修改时依然要保持不能和现有的数据重复
    if (temp && temp.id !== config.id) {
      if (temp.title === params.title) {
        ctx.throw(409, '配置信息已存在');
      }
    }
    return service.config.findByIdAndUpdate(id, params);
  }

  /**
   * 获取一个配置
   * @param id
   */
  async show(id) {
    const { ctx, service } = this;
    const config = await service.config.find(id);
    if (!config) {
      ctx.throw(404, `配置信息不存在 ${id}`);
    }
    return config;
  }

  /**
   * 获取配置列表，可根据参数判断是否分页，搜索
   * @param params 查询参数
   */
  async index(params) {
    const { ctx } = this;
    const { page, limit } = params;
    let result = [];
    let currentCount = 0;
    let totalCount = 0;
    // 计算分页
    const skip = Number(page) * Number(limit || 20);
    // 组装查询参数
    const query = {};

    result = await ctx.model.Config.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .exec();
    currentCount = result.length;
    totalCount = await ctx.model.Config.count(query).exec();

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
   * 通过 Id 查找一个配置
   * @param id
   */
  async find(id) {
    return this.ctx.model.Config.findById(id);
  }

  /**
   * 通过配置名称查找一个配置
   * @param alias
   */
  async findByAlias(alias) {
    return this.ctx.model.Config.findOne({ alias });
  }

  /**
   * 更新配置信息
   * @param id 用户 Id
   * @param params 需要更新的信息
   */
  async findByIdAndUpdate(id, params) {
    return this.ctx.model.Config.findByIdAndUpdate(id, params, { new: true });
  }
}

module.exports = ConfigService;
