/**
 * Create by lzan13 2020/7/7
 * 描述：喜欢处理服务
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

class LikeService extends Service {

  /**
   * 创建一个新喜欢
   * @param type 喜欢类型 0-用户 1-帖子 2-评论
   * @param id 喜欢的 id
   */
  async create(type, id) {
    const { ctx, service } = this;
    const params = {
      owner: ctx.state.user.id,
      type: Number(type),
    };
    if (Number(type) === 0) {
      params.user = id;
    } else if (Number(type) === 1) {
      params.post = id;
    } else if (Number(type) === 2) {
      params.comment = id;
    }
    // 先查询下是否已经存在
    let like = await ctx.model.Like.findOne(params);
    if (like) {
      ctx.throw(409, '已喜欢过了');
    }
    // 创建喜欢关系
    like = await ctx.model.Like.create(params);

    if (Number(type) === 0) {
      // 修改用户获得喜欢数+1
      await ctx.model.User.findByIdAndUpdate(id, { $inc: { likeCount: 1 } });
    } else if (Number(type) === 1) {
      const post = await service.post.find(id);
      if (!post) {
        ctx.throw(404, '内容不存在');
      }
      // 修改用户获得喜欢数+1
      await ctx.model.User.findByIdAndUpdate(post.owner.id, { $inc: { likeCount: 1 } });
      // 修改帖子获得喜欢数+1
      await ctx.model.Post.findByIdAndUpdate(id, { $inc: { likeCount: 1 } });
    } else if (Number(type) === 2) {
      // 修改评论获得喜欢数+1
      await ctx.model.Comment.findByIdAndUpdate(id, { $inc: { likeCount: 1 } });
    }

    return like;
  }

  /**
   * 删除一个喜欢
   */
  async destroy(type, id) {
    const { ctx, service } = this;
    const params = {
      owner: ctx.state.user.id,
      type,
    };
    if (Number(type) === 0) {
      params.user = id;
    } else if (Number(type) === 1) {
      params.post = id;
    } else if (Number(type) === 2) {
      params.comment = id;
    }
    // 先查询下是否已经存在
    const like = await ctx.model.Like.findOne(params);
    if (!like) {
      ctx.throw(404, '你并没有喜欢，无法取消');
    }

    if (Number(type) === 0) {
      // 修改用户获得喜欢数-1
      await ctx.model.User.findByIdAndUpdate(id, { $inc: { likeCount: -1 } });
    } else if (Number(type) === 1) {
      const post = await service.post.find(id);
      if (!post) {
        ctx.throw(404, '内容不存在');
      }
      // 修改用户获得喜欢数-1
      await ctx.model.User.findByIdAndUpdate(post.owner.id, { $inc: { likeCount: -1 } });
      // 修改帖子获得喜欢数-1
      await ctx.model.Post.findByIdAndUpdate(id, { $inc: { likeCount: -1 } });
    } else if (Number(type) === 2) {
      // 修改评论获得喜欢数-1
      await ctx.model.Comment.findByIdAndUpdate(id, { $inc: { likeCount: -1 } });
    }

    return ctx.model.Like.findByIdAndRemove(like.id);
  }


  /**
   * 获取喜欢列表，可根据参数判断是否分页，搜索
   * @param params 查询参数，当 参数为空时查询自己喜欢内容的
   */
  async index(params) {
    const { ctx } = this;
    const { type, id, owner, page, limit } = params;
    let result = [];
    let currentCount = 0;
    let totalCount = 0;
    const currentUserId = ctx.state.user.id;
    // 计算分页
    const skip = Number(page) * Number(limit || 20);
    // 组装查询参数
    const query = { type: Number(type) };
    if (owner) {
      // 查询用户喜欢的
      query.owner = owner;
    } else {
      if (Number(type) === 0 && id) {
        // 查询喜欢用户的用户集合
        query.user = id;
      } else if (Number(type) === 1 && id) {
        // 查询喜欢内容的用户集合
        query.post = id;
      } else if (Number(type) === 2 && id) {
        // 查询喜欢某评论的用户集合
        query.comment = id;
      } else {
        // id 为空则查询我喜欢的
        query.owner = currentUserId;
      }
    }
    if (id) {
      // 查询喜欢的用户的用户集合
      result = await ctx.model.Like.find(query)
        .populate('owner', userSelect)
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 })
        .exec();
    } else {
      // 查询用户喜欢集合
      if (Number(type) === 0) {
        result = await ctx.model.Like.find(query)
          .populate('user', userSelect)
          .skip(skip)
          .limit(Number(limit))
          .sort({ createdAt: -1 })
          .exec();
      } else if (Number(type) === 1) {
        result = await ctx.model.Like.find(query)
          .populate({
            path: 'post',
            select: { deleted: 0, deletedAt: 0 },
            populate: [
              { path: 'owner', select: userSelect },
              { path: 'category', select: { title: 1, desc: 1 } },
              { path: 'attachments', select: { extname: 1, path: 1 } },
            ],
          })
          .skip(skip)
          .limit(Number(limit))
          .sort({ createdAt: -1 })
          .exec();
      } else if (Number(type) === 2) {
        result = await ctx.model.Like.find(query)
          .populate('comment')
          .skip(skip)
          .limit(Number(limit))
          .sort({ createdAt: -1 })
          .exec();
      }
    }

    currentCount = result.length;
    totalCount = await ctx.model.Like.count(query)
      .exec();

    // 整理数据源 -> Ant Design Pro
    const data = result.map(item => {
      const json = Object.assign({}, item._doc);
      // 格式化一下返回给客户端的时间戳样式
      // json.createdAt = ctx.helper.formatTime(item.createdAt);
      // json.updatedAt = ctx.helper.formatTime(item.updatedAt);
      if (Number(type) === 0) {
        return json.user;
      } else if (Number(type) === 1) {
        return json.post;
      } else if (Number(type) === 2) {
        return json.comment;
      }
      return json;
    });

    return { currentCount, totalCount, page: Number(page), limit: Number(limit), data };
  }

  /**
   * 查询是否喜欢
   */
  async isLike(type, owner, id) {
    const { ctx } = this;
    const query = { owner };
    if (type === 0) {
      query.user = id;
    } else if (type === 1) {
      query.post = id;
    } else if (type === 2) {
      query.comment = id;
    }
    const result = await ctx.model.Like.findOne(query);
    if (result) {
      return true;
    }
    return false;
  }

  /**
   * ===================================================================================
   * 通用方法，主要是这些方法有多个地方调用，简单封装下
   */
  /**
   * 通过 Id 查找一个喜欢
   */
  async find(id) {
    return this.ctx.model.Like.findById(id);
  }

}

module.exports = LikeService;
