/**
 * Create by lzan13 2020/7/7
 * 描述：分类信息处理服务
 */
'use strict';

const Service = require('egg').Service;

class CategoryService extends Service {

  /**
   * 创建一个新分类
   * @param params
   */
  async create(params) {
    const { ctx, service } = this;
    let category = await service.category.findByTitle(params.title);
    if (category) {
      ctx.throw(409, '分类已存在');
    }
    category = await ctx.model.Category.create(params);
    return category;
  }

  /**
   * 删除一个分类
   * @param id
   */
  async destroy(id) {
    const { ctx, service } = this;
    const category = await service.category.find(id);
    if (!category) {
      ctx.throw(404, `分类不存在 ${id}`);
    }
    return ctx.model.Category.findByIdAndRemove(id);
  }

  /**
   * 批量删除分类
   * @param ids 需要删除的分类 Id 集合
   */
  async destroyList(ids) {
    return this.ctx.model.Category.remove({ _id: { $in: ids } });
  }

  /**
   * 更新分类
   * @param id
   * @param params
   */
  async update(id, params) {
    const { ctx, service } = this;
    const category = await service.category.find(id);
    if (!category) {
      ctx.throw(404, `分类不存在 ${id}`);
    }
    const temp = await service.category.findByTitle(params.title);
    // 修改时依然要保持不能和现有的数据重复
    if (temp && temp.id !== category.id) {
      if (temp.title === params.title) {
        ctx.throw(409, '分类已存在');
      }
    }
    return service.category.findByIdAndUpdate(id, params);
  }

  /**
   * 获取一个分类
   * @param id
   */
  async show(id) {
    const { ctx, service } = this;
    const category = await service.category.find(id);
    if (!category) {
      ctx.throw(404, `分类不存在 ${id}`);
    }
    return category;
  }

  /**
   * 获取分类列表，可根据参数判断是否分页，搜索
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

    result = await ctx.model.Category.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .exec();
    currentCount = result.length;
    totalCount = await ctx.model.Category.count(query).exec();

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
   * 通过 Id 查找一个分类
   * @param id
   */
  async find(id) {
    return this.ctx.model.Category.findById(id);
  }

  /**
   * 通过分类名称查找一个分类
   * @param title
   */
  async findByTitle(title) {
    return this.ctx.model.Category.findOne({ title });
  }

  /**
   * 更新分类信息
   * @param id
   * @param params 需要更新的信息
   */
  async findByIdAndUpdate(id, params) {
    return this.ctx.model.Category.findByIdAndUpdate(id, params, { new: true });
  }

}

module.exports = CategoryService;
