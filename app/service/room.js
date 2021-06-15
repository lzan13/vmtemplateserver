/**
 * Create by lzan13 2020/7/7
 * 描述：房间信息处理服务
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

class RoomService extends Service {

  /**
   * 创建
   * @param params
   */
  async create(params) {
    const { ctx, service } = this;
    if (!params.owner) {
      params.owner = ctx.state.user.id;
    }
    const id = await service.easemob.createRoom(params.title, params.desc, params.owner);
    if (!id || id === '') {
      ctx.throw(500, '房间创建失败');
    }
    params._id = id;
    await ctx.model.Room.create(params);
    return await service.room.find(id);
  }

  /**
   * 删除
   * @param id 房间 id
   */
  async destroy(id) {
    const { ctx, service } = this;
    // 先判断下权限
    const room = await service.room.find(id);
    if (!room) {
      ctx.throw(404, `房间不存在 ${id}`);
    } else {
      const userId = ctx.state.user.id;
      const identity = ctx.state.user.identity;
      if (identity <= 9 && room.owner.id !== userId) {
        ctx.throw(403, '无权操作，普通用户只能操作自己创建的房间');
      }
    }
    // 先删除三方的数据
    await service.easemob.destroyRoom(id);
    // 删除
    return ctx.model.Room.findByIdAndRemove(id);
  }

  /**
   * 更新信息
   * @param id
   * @param params
   */
  async update(id, params) {
    const { ctx, service } = this;
    // 先判断下权限
    const room = await service.room.find(id);
    if (!room) {
      ctx.throw(404, '房间不存在');
    } else {
      const userId = ctx.state.user.id;
      const identity = ctx.state.user.identity;
      if (identity <= 9 && room.owner.id !== userId) {
        ctx.throw(403, '无权操作，普通用户只能操作自己创建的房间');
      }
    }
    // 同步更新到三方服务
    await service.easemob.updateRoom(id, params.title, params.desc);

    return service.room.findByIdAndUpdate(id, params);
  }

  /**
   * 获取信息
   * @param id
   */
  async show(id) {
    const { ctx, service } = this;
    const room = await service.room.find(id);
    if (!room) {
      ctx.throw(404, `房间不存在 ${id}`);
    }
    return room;
  }

  /**
   * 获取内容列表，可根据参数判断是否分页，搜索
   * @param params 查询参数
   */
  async index(params) {
    const { ctx } = this;
    const { page, limit, owner } = params;
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
    result = await ctx.model.Room.find(query)
      .populate('owner', userSelect)
      .populate('managers', userSelect)
      .populate('members', userSelect)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .exec();
    currentCount = result.length;
    totalCount = await ctx.model.Room.count(query).exec();

    // 去三方服务查下当前房间人数，后续还要查下人员信息
    for (const room of result) {
      const info = await this.service.easemob.roomInfo(room._id);
      room._doc.count = info.affiliations_count;
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
   * 通过 Id 查找
   * @param id
   */
  async find(id) {
    return this.ctx.model.Room.findById(id)
      .populate('owner', userSelect)
      .exec();
  }

  /**
   * 更新信息
   * @param id
   * @param params 需要更新的信息
   */
  async findByIdAndUpdate(id, params) {
    return this.ctx.model.Room.findByIdAndUpdate(id, params);
  }

}

module.exports = RoomService;
