/**
 * Create by lzan13 2020/7/7
 * 描述：评论信息处理服务
 */
'use strict';

const Service = require('egg').Service;
const userSelect = {
  username: 1,
  avatar: 1,
  cover: 1,
  gender: 1,
  nickname: 1,
  deleted: 1,
  deletedReason: 1,
};

class CommentService extends Service {

  /**
   * 创建一个新评论
   * @param params
   */
  async create(params) {
    const { ctx } = this;
    // 设置评论发布者
    params.owner = ctx.state.user.id;
    let comment = await ctx.model.Comment.create(params);

    // 修改评论评论数+1
    await ctx.model.Post.findByIdAndUpdate(params.post, { $inc: { commentCount: 1 } });
    comment = await this.find(comment.id);
    return comment;
  }

  /**
   * 删除一个评论
   * @param id
   */
  async destroy(id) {
    const { ctx, service } = this;
    const comment = await service.comment.find(id);
    if (!comment) {
      ctx.throw(404, `评论不存在 ${id}`);
    } else {
      const userId = ctx.state.user.id;
      const identity = ctx.state.user.identity;
      if (identity < 700 && comment.owner.id !== userId) {
        ctx.throw(403, '普通用户只能操作自己评论');
      }
    }

    // 修改评论评论数-1
    await ctx.model.Post.findByIdAndUpdate(comment.post, { $inc: { commentCount: -1 } });

    return ctx.model.Comment.findByIdAndRemove(id);
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
    return ctx.model.Comment.remove({ _id: { $in: ids } });
  }
  /**
   * 更新评论
   * @param id
   * @param params
   */
  async update(id, params) {
    const { ctx, service } = this;
    const comment = await service.comment.find(id);
    if (!comment) {
      ctx.throw(404, `评论不存在 ${id}`);
    }
    return service.comment.findByIdAndUpdate(id, params);
  }

  /**
   * 获取一个评论
   * @param id
   */
  async show(id) {
    const { ctx, service } = this;
    const comment = await service.comment.find(id);
    if (!comment) {
      ctx.throw(404, `评论不存在 ${id}`);
    }
    return comment;
  }

  /**
   * 获取评论列表，可根据参数判断是否分页，搜索
   * @param params 查询参数
   */
  async index(params) {
    const { ctx } = this;
    const { page, limit, owner, user, post } = params;
    let result = [];
    let currentCount = 0;
    let totalCount = 0;
    const currUserId = ctx.state.user.id;
    // 计算分页
    const skip = Number(page || 0) * Number(limit || 20);
    // 组装查询参数
    const query = {};
    if (owner) {
      query.owner = owner;
    }
    if (user) {
      query.user = user;
    }
    if (post) {
      query.post = post;
    }

    result = await ctx.model.Comment.find(query)
      // .populate('owner', userSelect)
      .populate({
        path: 'owner',
        select: userSelect,
        populate: [
          { path: 'role', select: { identity: 1 } },
        ],
      })
      .populate('user', userSelect)
      .populate('post', { title: 1 })
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .exec();
    currentCount = result.length;
    totalCount = await ctx.model.Comment.countDocuments(query).exec();

    for (const comment of result) {
      const isLike = await this.service.like.isLike(1, currUserId, comment.id);
      comment._doc.isLike = isLike;
    }
    // 整理数据源 -> Ant Design Pro
    const data = result.map(item => {
      // const json =
      // 格式化一下返回给客户端的时间戳样式
      // json.createdAt = ctx.helper.formatTime(item.createdAt);
      // json.updatedAt = ctx.helper.formatTime(item.updatedAt);
      return Object.assign({}, item._doc);
    });

    return { currentCount, totalCount, page: Number(page), limit: Number(limit), data };
  }


  /**
   * ===================================================================================
   * 通用方法，主要是这些方法有多个地方调用，简单封装下
   */
  /**
   * 通过 Id 查找一个评论
   * @param id
   */
  async find(id) {
    return this.ctx.model.Comment.findById(id)
      // .populate('owner', userSelect)
      .populate({
        path: 'owner',
        select: userSelect,
        populate: [
          { path: 'role', select: { identity: 1 } },
        ],
      })
      .populate('user', userSelect)
      .populate('post', { title: 1 })
      .exec();
  }

  /**
   * 更新内容信息
   * @param id
   * @param params 需要更新的信息
   */
  async findByIdAndUpdate(id, params) {
    return this.ctx.model.Comment.findByIdAndUpdate(id, params);
  }
}

module.exports = CommentService;
