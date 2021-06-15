/**
 * Create by lzan13 2020/7/7
 * 描述：内容信息处理服务
 */
'use strict';

const Service = require('egg').Service;
const userSelect = {
  username: 1,
  avatar: 1,
  cover: 1,
  gender: 1,
  nickname: 1,
  signature: 1,
  deleted: 1,
  deletedReason: 1,
};

class PostService extends Service {

  /**
   * 创建一个新内容
   * @param params
   */
  async create(params) {
    const { ctx } = this;
    const userId = ctx.state.user.id;
    // 设置内容发布者
    params.owner = userId;
    const post = await ctx.model.Post.create(params);
    // 修改用户内容数+1
    await ctx.model.User.findByIdAndUpdate(userId, { $inc: { postCount: 1 } });
    return post;
  }

  /**
   * 删除一个内容
   * @param id
   */
  async destroy(id) {
    const { ctx, service } = this;
    // 先判断下权限
    const post = await service.post.find(id);
    if (!post) {
      ctx.throw(404, `内容不存在 ${id}`);
    } else {
      const userId = ctx.state.user.id;
      const identity = ctx.state.user.identity;
      if (identity <= 9 && post.owner.id !== userId) {
        ctx.throw(403, '无权操作，普通用户只能操作自己内容');
      }
    }
    // 修改用户内容数-1
    const userId = ctx.state.user.id;
    await ctx.model.User.findByIdAndUpdate(userId, { $inc: { postCount: -1 } });
    // 删除内容下的评论
    await ctx.model.Comment.deleteMany({ post: this.app.mongoose.Types.ObjectId(post.id) });
    // 删除内容
    return ctx.model.Post.findByIdAndRemove(id);
  }

  /**
   * 删除内容，这里的销毁是软删除，将内容状态改为删除
   * @param id 内容 id
   * @param reason 删除理由
   */
  async delete(id) {
    const { ctx, service } = this;
    const post = await service.post.find(id);
    if (!post) {
      ctx.throw(404, `内容不存在 ${id}`);
    } else {
      const userId = ctx.state.user.id;
      const identity = ctx.state.user.identity;
      if (identity <= 9 && post.owner.id !== userId) {
        ctx.throw(403, '无权操作，普通用户只能操作自己内容');
      }
    }
    // 修改用户内容数-1
    const userId = ctx.state.user.id;
    await ctx.model.User.findByIdAndUpdate(userId, { $inc: { postCount: -1 } });
    return service.post.findByIdAndUpdate(id, { deleted: 1 });
  }

  /**
   * 更新内容
   * @param id
   * @param params
   */
  async update(id, params) {
    const { ctx, service } = this;
    // 先判断下权限
    const post = await service.post.find(id);
    if (!post) {
      ctx.throw(404, '内容不存在');
    } else {
      const userId = ctx.state.user.id;
      const identity = ctx.state.user.identity;
      if (identity <= 9 && post.owner.id !== userId) {
        ctx.throw(403, '普通用户只能操作自己发布的内容');
      }
    }
    return service.post.findByIdAndUpdate(id, params);
  }

  /**
   * 获取一个内容
   * @param id
   */
  async show(id) {
    const { ctx, service } = this;
    const post = await service.post.find(id);
    if (!post) {
      ctx.throw(404, `内容不存在 ${id}`);
    }
    return post;
  }

  /**
   * 获取内容列表，可根据参数判断是否分页，搜索
   * @param params 查询参数
   */
  async index(params) {
    const { ctx } = this;
    const { page, limit, owner, stick, category, deleted } = params;
    let result = [];
    let currentCount = 0;
    let totalCount = 0;
    const currentUserId = ctx.state.user.id;
    // 计算分页
    const skip = Number(page) * Number(limit || 20);
    // 组装查询参数
    const query = { deleted: Number(deleted) || 0 };
    if (owner) {
      query.owner = owner;
    }
    if (stick) {
      query.stick = stick;
    }
    if (category) {
      query.category = category;
    }
    result = await ctx.model.Post.find(query, { deleted: 0, deletedAt: 0 })
      .populate('owner', userSelect)
      .populate('category', { title: 1, desc: 1 })
      .populate('attachments', { extname: 1, path: 1 })
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .exec();
    currentCount = result.length;
    totalCount = await ctx.model.Post.count(query).exec();

    for (const post of result) {
      const isLike = await this.service.like.isLike(1, currentUserId, post.id);
      post._doc.isLike = isLike;
    }
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
   * 通过 Id 查找一个内容
   * @param id
   */
  async find(id) {
    return this.ctx.model.Post.findById(id)
      .populate('owner', userSelect)
      .populate('category', { title: 1 })
      .populate('attachments', { extname: 1, path: 1 })
      .exec();
  }

  /**
   * 更新内容信息
   * @param id
   * @param params 需要更新的信息
   */
  async findByIdAndUpdate(id, params) {
    return this.ctx.model.Post.findByIdAndUpdate(id, params);
  }

}

module.exports = PostService;
