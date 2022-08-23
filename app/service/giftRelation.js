/**
 * Create by lzan13 2022/05/24
 * 描述：礼物记录数据处理服务
 */
'use strict';

const Service = require('egg').Service;

class GiftRelationService extends Service {

  /**
   * 创建
   * @param params
   */
  async create(params) {
    const { ctx } = this;
    return await ctx.model.GiftRelation.create(params);
  }

  /**
   * 删除
   * @param id
   */
  async destroy(id) {
    const { ctx, service } = this;
    // 先判断下权限
    const identity = ctx.state.user.identity;
    if (identity < 700) {
      ctx.throw(403, '无权操作');
    }
    const giftRelation = await service.giftRelation.find(id);
    if (!giftRelation) {
      ctx.throw(404, `数据不存在 ${id}`);
    }
    // 删除
    return ctx.model.GiftRelation.findByIdAndRemove(id);
  }

  /**
   * 更新内容
   * @param id
   * @param params
   */
  async update(id, params) {
    const { ctx, service } = this;
    const giftRelation = await service.giftRelation.find(id);
    if (!giftRelation) {
      ctx.throw(404, '数据不存在');
    }
    return service.giftRelation.findByIdAndUpdate(id, params);
  }

  /**
   * 获取数据列表，可根据参数判断是否分页，搜索
   * @param params 查询参数
   */
  async index(params) {
    const { ctx } = this;
    const { user, page, limit } = params;
    let result = [];
    let currentCount = 0;
    let totalCount = 0;
    // 计算分页
    const skip = Number(page || 0) * Number(limit || 100);
    const currUser = ctx.state.user;
    // 组装查询参数
    const query = {};
    const select = { title: 1, cover: 1, animation: 1, price: 1, type: 1 };
    const populate = [{
      path: 'gift', select, populate: [
        { path: 'cover', select: { extname: 1, path: 1, width: 1, height: 1 } },
        { path: 'animation', select: { extname: 1, path: 1 } },
      ],
    }];
    if (user) {
      query.user = user;
    } else {
      // id 为空则判断当前身份，管理员查询全部数据，自己查询我喜欢的
      if (currUser.identity < 300) {
        query.user = currUser.id;
      } else {
        select.user = 1;
        populate.push({ path: 'user', select: { nickname: 1 } });
      }
    }

    result = await ctx.model.GiftRelation.find(query)
      .skip(skip)
      .populate(populate)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .exec();
    currentCount = result.length;
    totalCount = await ctx.model.GiftRelation.countDocuments(query)
      .exec();

    // 整理数据源 -> Ant Design Pro
    const data = result.map(item => {
      const json = Object.assign({}, item._doc);
      const gift = Object.assign({}, json.gift._doc);
      gift.relationId = json._id;

      if (query.user === undefined) {
        gift.owner = json.user;
      }
      gift.count = json.count;
      return gift;
    });

    return { currentCount, totalCount, page: Number(page), limit: Number(limit), data };
  }


  /**
   * ===================================================================================
   * 通用方法，主要是这些方法有多个地方调用，简单封装下
   */
  /**
   * 通过 Id 查找
   * @param id
   */
  async find(id) {
    return this.ctx.model.GiftRelation.findById(id)
      .exec();
  }

  /**
   * 通过条件查找
   * @param query
   */
  async findOne(query) {
    return this.ctx.model.GiftRelation.findOne(query)
      .exec();
  }

  /**
   * 更新
   * @param id
   * @param params 需要更新的信息
   */
  async findByIdAndUpdate(id, params) {
    return this.ctx.model.GiftRelation.findByIdAndUpdate(id, params);
  }

  /**
   * 更新
   * @param id
   * @param params 需要更新的信息
   */
  async findOneAndUpdate(query, params) {
    return this.ctx.model.GiftRelation.findOneAndUpdate(query, params);
  }

}

module.exports = GiftRelationService;
