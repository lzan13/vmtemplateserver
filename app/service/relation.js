/**
 * Create by lzan13 2020/7/7
 * 描述：用户关系处理服务
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

class RelationService extends Service {

  /**
   * 创建一个新关注
   * @param user2 被关注的人
   */
  async create(user2) {
    const { ctx, service } = this;
    const user1 = ctx.state.user.id;
    let params = { user1, user2 };
    // 首先通过 A=>B 查询关系
    let relation = await ctx.model.Relation.findOne(params);
    if (relation) {
      if (relation.relation === 0 || relation.relation === 2) {
        // A->B A<->B 都表示已关注
        ctx.throw(409, '你已关注对方');
      } else {
        // 说明 B->A 这里要改成 A<->B
        relation.relation = 2;
      }
    } else {
      params = { user1: user2, user2: user1 };
      // 根据 B=>A 查询关系
      relation = await ctx.model.Relation.findOne(params);
      if (relation) {
        if (relation.relation === 1 || relation.relation === 2) {
          // B->A B<->A 都表示已关注
          ctx.throw(409, '你已关注对方');
        } else {
          // 说明 A->B 这里要改成 B<->A
          relation.relation = 2;
        }
      }
    }
    if (relation) {
      // 更新关注关系
      relation = await service.relation.findByIdAndUpdate(relation.id, { relation: relation.relation });
    } else {
      // 创建关注关系
      relation = await ctx.model.Relation.create({ user1, user2, relation: 0 });
    }

    // 修改粉丝的关注数+1
    await ctx.model.User.findByIdAndUpdate(user1, { $inc: { relationCount: 1 } });
    // 修改关注的人的粉丝数+1
    await ctx.model.User.findByIdAndUpdate(user2, { $inc: { fansCount: 1 } });

    return relation;
  }

  /**
   * 删除数据
   */
  async destroy(id) {
    const { ctx, service } = this;
    // 先判断下权限
    const identity = ctx.state.user.identity;
    if (identity < 700) {
      ctx.throw(403, '无权操作');
    }
    const relation = await service.relation.find(id);
    if (!relation) {
      ctx.throw(404, `数据不存在 ${id}`);
    }
    return ctx.model.Relation.findByIdAndRemove(id);
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
    return ctx.model.Relation.remove({ _id: { $in: ids } });
  }
  /**
   * 取消关注
   * @param user2
   */
  async cancelFollow(user2) {
    const { ctx, service } = this;
    const user1 = ctx.state.user.id;

    let params = { user1, user2 };
    // 首先通过 A=>B 查询关系
    let relation = await ctx.model.Relation.findOne(params);
    if (relation) {
      if (relation.relation === 1) {
        // B->A A<->B 才表示关注对方
        ctx.throw(404, '你没有关注对方');
      } else {
        if (relation.relation === 0) {
          // 互相都无关注，后边会删除数据
          relation.relation = -1;
        } else {
          // 改为单向关注 B->A
          relation.relation = 1;
        }
      }
    } else {
      params = { user1: user2, user2: user1 };
      // 根据 B=>A 查询关系
      relation = await ctx.model.Relation.findOne(params);
      if (relation) {
        if (relation.relation === 0) {
          // B->A A<->B 才表示关注对方
          ctx.throw(404, '你没有关注对方');
        } else {
          if (relation.relation === 1) {
            // 互相都无关注，后边会删除数据
            relation.relation = -1;
          } else {
            // 改为单向关注 B->A
            relation.relation = 0;
          }
        }
      } else {
        ctx.throw(404, '你没有关注对方');
      }
    }

    // 修改粉丝的关注数+1
    await ctx.model.User.findByIdAndUpdate(user1, { $inc: { relationCount: -1 } });
    // 修改关注的人的粉丝数+1
    await ctx.model.User.findByIdAndUpdate(user2, { $inc: { fansCount: -1 } });

    if (relation.relation === -1) {
      return ctx.model.Relation.findByIdAndRemove(relation.id);
    }
    return service.relation.findByIdAndUpdate(relation.id, { relation: relation.relation });
  }

  /**
   * 更新关系
   * @param id
   * @param params
   */
  async update(id, params) {
    const { ctx, service } = this;
    const relation = await service.relation.find(id);
    if (!relation) {
      ctx.throw(404, `关系不存在 ${id}`);
    }
    return service.relation.findByIdAndUpdate(id, params);
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
    let relation = await ctx.model.Relation.findOne(params);
    if (relation) {
      // 直接返回关系
      return relation.relation;
    }
    params = { user1: user2, user2: user1 };
    // 根据 B=>A 查询关系
    relation = await ctx.model.Relation.findOne(params);
    if (relation) {
      // 这里将 B->A 转换为 A->B
      if (relation.relation === 0) {
        return 1;
      } else if (relation.relation === 1) {
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
    const skip = Number(page || 0) * Number(limit || 20);
    // 组装查询参数
    let query = {};
    let currUserId = ctx.state.user.id;
    if (userId) {
      currUserId = userId;
    }
    if (Number(type) === 0) {
      // 查询某人关注的用户集合
      query = {
        $or: [
          { user1: currUserId, relation: 0 }, { user1: currUserId, relation: 2 },
          { user2: currUserId, relation: 1 }, { user2: currUserId, relation: 2 },
        ],
      };
    } else if (Number(type) === 1) {
      // 查询关注某人的集合
      query = {
        $or: [
          { user2: currUserId, relation: 0 }, { user2: currUserId, relation: 2 },
          { user1: currUserId, relation: 1 }, { user1: currUserId, relation: 2 },
        ],
      };
    } else if (Number(type) === 2) {
      // 查询互相关注的用户集合
      query = { $or: [{ user1: currUserId }, { user2: currUserId }], relation: 2 };
    } else {
      query = {};
    }

    // 查询关系数据
    result = await ctx.model.Relation.find(query)
      .populate('user1', userSelect)
      .populate('user2', userSelect)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .exec();

    currentCount = result.length;
    totalCount = await ctx.model.Relation.countDocuments(query)
      .exec();

    // 整理数据源 -> Ant Design Pro
    const data = result.map(item => {
      const json = Object.assign({}, item._doc);
      if (type && type <= 2) {
        // 去除外层数据
        let result;
        if (currUserId === item.user1.id) {
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
      }
      return json;
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
    return this.ctx.model.Relation.findById(id)
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
    return this.ctx.model.Relation.findByIdAndUpdate(id, params);
  }
}

module.exports = RelationService;
