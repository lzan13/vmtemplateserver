/**
 * Create by lzan13 2020/7/7
 * 描述：关注信息处理服务
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

class FollowService extends Service {

  /**
   * 创建一个新关注
   * @param user2 被关注的人
   */
  async create(user2) {
    const { ctx, service } = this;
    const user1 = ctx.state.user.id;
    let params = { user1, user2 };
    // 首先通过 A=>B 查询关系
    let follow = await ctx.model.Follow.findOne(params);
    if (follow) {
      if (follow.relation === 0 || follow.relation === 2) {
        // A->B A<->B 都表示已关注
        ctx.throw(409, '你已关注对方');
      } else {
        // 说明 B->A 这里要改成 A<->B
        follow.relation = 2;
      }
    } else {
      params = { user1: user2, user2: user1 };
      // 根据 B=>A 查询关系
      follow = await ctx.model.Follow.findOne(params);
      if (follow) {
        if (follow.relation === 1 || follow.relation === 2) {
          // B->A B<->A 都表示已关注
          ctx.throw(409, '你已关注对方');
        } else {
          // 说明 A->B 这里要改成 B<->A
          follow.relation = 2;
        }
      }
    }
    if (follow) {
      // 更新关注关系
      follow = await service.follow.findByIdAndUpdate(follow.id, { relation: follow.relation });
    } else {
      // 创建关注关系
      follow = await ctx.model.Follow.create({ user1, user2, relation: 0 });
    }

    // 修改粉丝的关注数+1
    await ctx.model.User.findByIdAndUpdate(user1, { $inc: { followCount: 1 } });
    // 修改关注的人的粉丝数+1
    await ctx.model.User.findByIdAndUpdate(user2, { $inc: { fansCount: 1 } });

    return follow;
  }

  /**
   * 删除一个关注
   * @param user2
   */
  async destroy(user2) {
    const { ctx, service } = this;
    const user1 = ctx.state.user.id;

    let params = { user1, user2 };
    // 首先通过 A=>B 查询关系
    let follow = await ctx.model.Follow.findOne(params);
    if (follow) {
      if (follow.relation === 1) {
        // B->A A<->B 才表示关注对方
        ctx.throw(404, '你没有关注对方');
      } else {
        if (follow.relation === 0) {
          // 互相都无关注，后边会删除数据
          follow.relation = -1;
        } else {
          // 改为单向关注 B->A
          follow.relation = 1;
        }
      }
    } else {
      params = { user1: user2, user2: user1 };
      // 根据 B=>A 查询关系
      follow = await ctx.model.Follow.findOne(params);
      if (follow) {
        if (follow.relation === 0) {
          // B->A A<->B 才表示关注对方
          ctx.throw(404, '你没有关注对方');
        } else {
          if (follow.relation === 1) {
            // 互相都无关注，后边会删除数据
            follow.relation = -1;
          } else {
            // 改为单向关注 B->A
            follow.relation = 0;
          }
        }
      } else {
        ctx.throw(404, '你没有关注对方');
      }
    }

    // 修改粉丝的关注数+1
    await ctx.model.User.findByIdAndUpdate(user1, { $inc: { followCount: -1 } });
    // 修改关注的人的粉丝数+1
    await ctx.model.User.findByIdAndUpdate(user2, { $inc: { fansCount: -1 } });

    if (follow.relation === -1) {
      return ctx.model.Follow.findByIdAndRemove(follow.id);
    }
    return service.follow.findByIdAndUpdate(follow.id, { relation: follow.relation });
  }

  /**
   * 获取自己与某人的关系
   * @param userId 对方 id
   * @return 0-关注 1-被关注 2-互相关注
   */
  async relation(user2) {
    const { ctx } = this;
    const user1 = ctx.state.user.id;

    let params = { user1, user2 };
    // 首先通过 A=>B 查询关系
    let follow = await ctx.model.Follow.findOne(params);
    if (follow) {
      // 直接返回关系
      return follow.relation;
    }
    params = { user1: user2, user2: user1 };
    // 根据 B=>A 查询关系
    follow = await ctx.model.Follow.findOne(params);
    if (follow) {
      // 这里讲 B->A 转换为 A->B
      if (follow.relation === 0) {
        return 1;
      } else if (follow.relation === 1) {
        return 0;
      }
      return 2;
    }
    // 没有关系，返回 -1
    return -1;
  }

  /**
   * 获取关注列表，可根据参数判断是否分页，搜索
   * @param params 查询参数
   */
  async index(params) {
    const { ctx } = this;
    const { page, limit, userId, type } = params;
    let result = [];
    let currentCount = 0;
    let totalCount = 0;
    // 计算分页
    const skip = Number(page) * Number(limit || 20);
    // 组装查询参数
    let query = {};
    let user = ctx.state.user.id;
    if (userId) {
      user = userId;
    }
    if (Number(type) === 0) {
      // 查询某人关注的用户集合
      query = {
        $or: [
          { user1: user, relation: 0 }, { user1: user, relation: 2 },
          { user2: user, relation: 1 }, { user2: user, relation: 2 },
        ],
      };
    } else if (Number(type) === 1) {
      // 查询关注某人的集合
      query = {
        $or: [
          { user2: user, relation: 0 }, { user2: user, relation: 2 },
          { user1: user, relation: 1 }, { user1: user, relation: 2 },
        ],
      };
    } else if (Number(type) === 2) {
      query = { $or: [{ user1: user }, { user2: user }], relation: 2 };
    }

    // 查询关系数据
    result = await ctx.model.Follow.find(query)
      .populate('user1', userSelect)
      .populate('user2', userSelect)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .exec();

    currentCount = result.length;
    totalCount = await ctx.model.Follow.count(query).exec();

    // 整理数据源 -> Ant Design Pro
    const data = result.map(item => {
      const json = Object.assign({}, item._doc);
      // 去除外层数据
      let result;
      if (user === item.user1.id) {
        result = Object.assign({}, json.user2._doc);
      } else {
        result = Object.assign({}, json.user1._doc);
      }
      // 关系
      if (json.relation) {
        result.relation = json.relation;
      } else if (Number(type) === 0) {
        result.relation = 0;
      } else if (Number(type) === 1) {
        result.relation = 1;
      }
      return result;
    });

    return { currentCount, totalCount, page: Number(page), limit: Number(limit), data };
  }


  /**
   * ===================================================================================
   * 通用方法，主要是这些方法有多个地方调用，简单封装下
   */
  /**
   * 通过 Id 查找一个关注
   * @param id
   */
  async find(id) {
    return this.ctx.model.Follow.findById(id)
      .populate('user1', userSelect)
      .populate('user2', userSelect)
      .exec();
  }

  /**
   * 更新关注信息
   * @param 用户关系 Id
   * @param params 需要更新的信息
   */
  async findByIdAndUpdate(id, params) {
    return this.ctx.model.Follow.findByIdAndUpdate(id, params);
  }
}

module.exports = FollowService;
