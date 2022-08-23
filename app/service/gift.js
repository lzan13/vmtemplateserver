/**
 * Create by lzan13 2022/05/24
 * 描述：礼物数据处理服务
 */
'use strict';

const Service = require('egg').Service;

class GiftService extends Service {

  /**
   * 创建
   * @param params
   */
  async create(params) {
    const { ctx } = this;
    const identity = ctx.state.user.identity;
    if (identity < 700) {
      ctx.throw(403, '无权操作');
    }
    if (!params.cover || params.cover === '') {
      delete params.cover;
    }
    if (!params.animation || params.animation === '') {
      delete params.animation;
    }
    return await ctx.model.Gift.create(params);
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
    const gift = await service.gift.find(id);
    if (!gift) {
      ctx.throw(404, `数据不存在 ${id}`);
    }
    // 删除封面
    service.attachment.destroy(gift.cover);
    // 删除特效数据
    service.attachment.destroy(gift.animation);
    // 删除
    return ctx.model.Gift.findByIdAndRemove(id);
  }

  /**
   * 更新内容
   * @param id
   * @param params
   */
  async update(id, params) {
    const { ctx, service } = this;
    // 先判断下权限
    const identity = ctx.state.user.identity;
    if (identity < 700) {
      ctx.throw(403, '无权操作');
    }
    const gift = await service.gift.find(id);
    if (!gift) {
      ctx.throw(404, '数据不存在');
    }
    if (params.cover) {
      if (gift.cover && gift.cover.id !== params.cover) {
        service.attachment.destroy(params.cover);
      }
    } else {
      delete params.cover;
    }
    if (params.animation) {
      if (gift.animation && gift.animation.id !== params.animation) {
        service.attachment.destroy(params.animation);
      }
    } else {
      delete params.animation;
    }
    return service.gift.findByIdAndUpdate(id, params);
  }

  /**
   * 获取一个内容
   * @param id
   */
  async show(id) {
    const { ctx, service } = this;
    const gift = await service.gift.find(id);
    if (!gift) {
      ctx.throw(404, `数据不存在 ${id}`);
    }
    return gift;
  }

  /**
   * 赠送礼物
   */
  async give(params) {
    const { ctx, service } = this;
    const gift = await service.gift.find(params.giftId);
    if (!gift) {
      ctx.throw(404, `数据不存在 ${params.giftId}`);
    }
    const user = await service.user.find(params.userId);
    if (!user) {
      ctx.throw(404, `用户不存在 ${params.userId}`);
    }

    const id = ctx.state.user.id;
    const self = await service.user.find(id);

    const count = gift.price * Number(params.count);
    if (self.score < count) {
      ctx.throw(412, '账户余额不足，可通过签到或充值等任务获取');
    }
    // 自己余额减少
    await service.user.findByIdAndUpdate(id, { $inc: { score: -count } });
    // 对方魅力增加，这里直接存储收到的礼物价值，后期自己再计算
    await service.user.findByIdAndUpdate(params.userId, {
      $inc: {
        charm: count,
        charmMonth: count,
        charmWeek: count,
      },
    });
    // // 对方魅力与礼物数增加
    // service.user.findOneAndUpdate({ id: params.userId, 'gifts.gift': gift.id }, { $inc: { 'gifts.$.count': 1 } });
    const giftRelation = await service.giftRelation.findOne({ user: params.userId, gift: gift.id });
    if (giftRelation) {
      // 收到礼物+
      await service.giftRelation.findOneAndUpdate({ user: params.userId, gift: gift.id }, { $inc: { count: params.count } });
    } else {
      await service.giftRelation.create({ user: params.userId, gift: gift.id, count: params.count });
    }

    // 记录资金消耗
    await service.score.create({ owner: id, title: '赠送礼物', count, type: 2, remarks: '用户赠送礼物操作消耗' });

    return gift;
  }

  /**
   * 获取数据列表，可根据参数判断是否分页，搜索
   * @param params 查询参数
   */
  async index(params) {
    const { ctx } = this;
    const { status, page, limit } = params;
    let result = [];
    let currentCount = 0;
    let totalCount = 0;
    // 计算分页
    const skip = Number(page || 0) * Number(limit || 100);
    // 组装查询参数
    const query = {};
    if (status) {
      query.status = status;
    }

    result = await ctx.model.Gift.find(query)
      .skip(skip)
      .populate('cover', { path: 1, space: 1, width: 1, height: 1 })
      .populate('animation', { extname: 1, path: 1, space: 1 })
      .limit(Number(limit))
      .sort({ price: 1 })
      .exec();
    currentCount = result.length;
    totalCount = await ctx.model.Gift.countDocuments(query)
      .exec();

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
   * 通过 Id 查找
   * @param id
   */
  async find(id) {
    return this.ctx.model.Gift.findById(id)
      .populate('cover', { path: 1, space: 1, width: 1, height: 1 })
      .populate('animation', { path: 1, space: 1 })
      .exec();
  }

  /**
   * 更新
   * @param id
   * @param params 需要更新的信息
   */
  async findByIdAndUpdate(id, params) {
    return this.ctx.model.Gift.findByIdAndUpdate(id, params);
  }

}

module.exports = GiftService;
