/**
 * Create by lzan13 2022/04/07
 * 描述：黑名单信息处理服务
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

class BlacklistService extends Service {

  /**
   * 创建
   * @param user2 被拉黑的人
   */
  async create(user2) {
    const { app, ctx, service } = this;
    const user1 = ctx.state.user.id;
    let params = { user1, user2 };
    // 首先通过 A=>B 查询关系
    let blacklist = await ctx.model.Blacklist.findOne(params);
    if (blacklist) {
      if (blacklist.relation === 0 || blacklist.relation === 2) {
        // A->B A<->B 都表示已拉黑
        ctx.throw(409, '你已拉黑对方');
      } else {
        // 说明 B->A 这里要改成 A<->B
        blacklist.relation = 2;
      }
    } else {
      params = { user1: user2, user2: user1 };
      // 根据 B=>A 查询关系
      blacklist = await ctx.model.Blacklist.findOne(params);
      if (blacklist) {
        if (blacklist.relation === 1 || blacklist.relation === 2) {
          // B->A B<->A 都表示已拉黑
          ctx.throw(409, '你已拉黑对方');
        } else {
          // 说明 A->B 这里要改成 B<->A
          blacklist.relation = 2;
        }
      }
    }
    if (blacklist) {
      // 更新拉黑关系
      blacklist = await service.blacklist.findByIdAndUpdate(blacklist.id, { relation: blacklist.relation });
    } else {
      // 创建拉黑关系
      blacklist = await ctx.model.Blacklist.create({ user1, user2, relation: 0 });
    }
    if (app.config.easemob.enable) {
      // 不论后端关系怎样，到im那边就是A->B
      service.third.easemob.addBlacklist(user1, user2);
    }
    return blacklist;
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
    const blacklist = await service.blacklist.find(id);
    if (!blacklist) {
      ctx.throw(404, `数据不存在 ${id}`);
    }
    return ctx.model.Blacklist.findByIdAndRemove(id);
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
    return ctx.model.Blacklist.remove({ _id: { $in: ids } });
  }
  /**
   * 取消
   * @param user2
   */
  async cancel(user2) {
    const { app, ctx, service } = this;
    const user1 = ctx.state.user.id;

    let params = { user1, user2 };
    // 首先通过 A=>B 查询关系
    let blacklist = await ctx.model.Blacklist.findOne(params);
    if (blacklist) {
      if (blacklist.relation === 1) {
        // B->A A<->B 才表示拉黑对方
        ctx.throw(404, '你没有拉黑对方');
      } else {
        if (blacklist.relation === 0) {
          // 互相都无拉黑，后边会删除数据
          blacklist.relation = -1;
        } else {
          // 改为单向拉黑 B->A
          blacklist.relation = 1;
        }
      }
    } else {
      params = { user1: user2, user2: user1 };
      // 根据 B=>A 查询关系
      blacklist = await ctx.model.Blacklist.findOne(params);
      if (blacklist) {
        if (blacklist.relation === 0) {
          // B->A A<->B 才表示拉黑对方
          ctx.throw(404, '你没有拉黑对方');
        } else {
          if (blacklist.relation === 1) {
            // 互相都无拉黑，后边会删除数据
            blacklist.relation = -1;
          } else {
            // 改为单向拉黑 B->A
            blacklist.relation = 0;
          }
        }
      } else {
        ctx.throw(404, '你没有拉黑对方');
      }
    }
    if (app.config.easemob.enable) {
      // 不论后端关系怎样，到im那边就是A-B
      await service.third.easemob.delBlacklist(user1, user2);
    }
    if (blacklist.relation === -1) {
      return ctx.model.Blacklist.findByIdAndRemove(blacklist.id);
    }

    return service.blacklist.findByIdAndUpdate(blacklist.id, { relation: blacklist.relation });
  }

  /**
   * 更新关系
   * @param id
   * @param params
   */
  async update(id, params) {
    const { ctx, service } = this;
    const blacklist = await service.blacklist.find(id);
    if (!blacklist) {
      ctx.throw(404, `关系不存在 ${id}`);
    }
    return service.blacklist.findByIdAndUpdate(id, params);
  }

  /**
   * 获取自己与某人的关系
   * @param userId 对方 id
   * @return 0-拉黑 1-被拉黑 2-互相拉黑
   */
  async relation(user2) {
    const { ctx } = this;
    const user1 = ctx.state.user.id;

    let params = { user1, user2 };
    // 首先通过 A=>B 查询关系
    let blacklist = await ctx.model.Blacklist.findOne(params);
    if (blacklist) {
      // 直接返回关系
      return blacklist.relation;
    }
    params = { user1: user2, user2: user1 };
    // 根据 B=>A 查询关系
    blacklist = await ctx.model.Blacklist.findOne(params);
    if (blacklist) {
      // 这里将 B->A 转换为 A->B
      if (blacklist.relation === 0) {
        return 1;
      } else if (blacklist.relation === 1) {
        return 0;
      }
      return 2;
    }
    // 没有关系，返回 -1
    return -1;
  }

  /**
   * 获取拉黑列表，可根据参数判断是否分页，搜索
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
      // 查询某人拉黑的用户集合
      query = {
        $or: [
          { user1: currUserId, relation: 0 }, { user1: currUserId, relation: 2 },
          { user2: currUserId, relation: 1 }, { user2: currUserId, relation: 2 },
        ],
      };
    } else if (Number(type) === 1) {
      // 查询拉黑某人的集合
      query = {
        $or: [
          { user2: currUserId, relation: 0 }, { user2: currUserId, relation: 2 },
          { user1: currUserId, relation: 1 }, { user1: currUserId, relation: 2 },
        ],
      };
    } else if (Number(type) === 2) {
      // 查询互相拉黑的用户集合
      query = { $or: [{ user1: currUserId }, { user2: currUserId }], relation: 2 };
    } else {
      query = {};
    }

    // 查询关系数据
    result = await ctx.model.Blacklist.find(query)
      .populate('user1', userSelect)
      .populate('user2', userSelect)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .exec();

    currentCount = result.length;
    totalCount = await ctx.model.Blacklist.countDocuments(query)
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
   * 通过 Id 查找一个拉黑
   * @param id
   */
  async find(id) {
    return this.ctx.model.Blacklist.findById(id)
      .populate('user1', userSelect)
      .populate('user2', userSelect)
      .exec();
  }

  /**
   * 更新拉黑信息
   * @param 用户关系 Id
   * @param params 需要更新的信息
   */
  async findByIdAndUpdate(id, params) {
    return this.ctx.model.Blacklist.findByIdAndUpdate(id, params);
  }
}

module.exports = BlacklistService;
