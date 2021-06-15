/**
 * Create by lzan13 2020/7/7
 * 描述：职业信息处理服务
 */
'use strict';

const Service = require('egg').Service;

class ProfessionService extends Service {

  /**
   * 创建一个新职业
   * @param params
   */
  async create(params) {
    const { ctx, service } = this;
    let profession = await service.profession.findByTitle(params.title);
    if (profession) {
      ctx.throw(409, '职业已存在');
    }
    profession = await ctx.model.Profession.create(params);
    return profession;
  }

  /**
   * 删除一个职业
   * @param id
   */
  async destroy(id) {
    const { ctx, service } = this;
    const profession = await service.profession.find(id);
    if (!profession) {
      ctx.throw(404, `职业不存在 ${id}`);
    }
    return ctx.model.Profession.findByIdAndRemove(id);
  }

  /**
   * 批量删除职业
   * @param ids 需要删除的职业 Id 集合
   */
  async destroyList(ids) {
    return this.ctx.model.Profession.remove({ _id: { $in: ids } });
  }

  /**
   * 更新职业
   * @param id
   * @param params
   */
  async update(id, params) {
    const { ctx, service } = this;
    const profession = await service.profession.find(id);
    if (!profession) {
      ctx.throw(404, `职业不存在 ${id}`);
    }
    const temp = await service.profession.findByTitle(params.title);
    // 修改时依然要保持不能和现有的数据重复
    if (temp && temp.id !== profession.id) {
      if (temp.title === params.title) {
        ctx.throw(409, '职业已存在');
      }
    }
    return service.profession.findByIdAndUpdate(id, params);
  }

  /**
   * 获取一个职业
   * @param id
   */
  async show(id) {
    const { ctx, service } = this;
    const profession = await service.profession.find(id);
    if (!profession) {
      ctx.throw(404, `职业不存在 ${id}`);
    }
    return profession;
  }

  /**
   * 获取职业列表，可根据参数判断是否分页，搜索
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

    result = await ctx.model.Profession.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .exec();
    currentCount = result.length;
    totalCount = await ctx.model.Profession.count(query).exec();

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
   * 通过 Id 查找一个职业
   * @param id
   */
  async find(id) {
    return this.ctx.model.Profession.findById(id);
  }

  /**
   * 通过职业名称查找一个职业
   */
  async findByTitle(title) {
    return this.ctx.model.Profession.findOne({ title });
  }

  /**
   * 更新职业信息
   * @param id
   * @param params 需要更新的信息
   */
  async findByIdAndUpdate(id, params) {
    return this.ctx.model.Profession.findByIdAndUpdate(id, params, { new: true });
  }

}

module.exports = ProfessionService;
