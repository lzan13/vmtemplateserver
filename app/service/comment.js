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
    const comment = await ctx.model.Comment.create(params);

    // 修改评论评论数+1
    await ctx.model.Post.findByIdAndUpdate(params.post, { $inc: { commentCount: 1 } });

    return comment;
  }

  /**
   * 删除一个评论
   * @param id
   */
  async destroy(id) {
    const { ctx, service } = this;
    // 先判断下权限
    const comment = await service.comment.find(id);
    if (!comment) {
      ctx.throw(404, `评论不存在 ${id}`);
    } else {
      const userId = ctx.state.user.id;
      const identity = ctx.state.user.identity;
      if (identity <= 9 && comment.owner.id !== userId) {
        ctx.throw(403, '普通用户只能操作自己评论');
      }
    }

    // 修改评论评论数-1
    await ctx.model.Post.findByIdAndUpdate(comment.post, { $inc: { commentCount: -1 } });

    return ctx.model.Comment.findByIdAndRemove(id);
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
    // 计算分页
    const skip = Number(page) * Number(limit || 20);
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
      .populate('owner', userSelect)
      .populate('user', userSelect)
      .populate('post', { title: 1 })
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .exec();
    currentCount = result.length;
    totalCount = await ctx.model.Comment.count(query).exec();

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
   * 通过 Id 查找一个评论
   * @param id
   */
  async find(id) {
    return this.ctx.model.Comment.findById(id)
      .populate('owner', userSelect)
      .populate('user', userSelect)
      .populate('post', { title: 1 })
      .exec();
  }
}

module.exports = CommentService;
