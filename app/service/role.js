/**
 * Create by lzan13 2020/7/7
 * 描述：角色信息处理服务
 */
'use strict';

const Service = require('egg').Service;

class RoleService extends Service {

  /**
   * 创建一个新角色
   * @param params
   */
  async create(params) {
    const { ctx } = this;
    let role = await ctx.model.Role.findOne({ title: params.title });
    if (role) {
      ctx.throw(409, '角色已存在');
    }
    role = await ctx.model.Role.create(params);
    return role;
  }

  /**
   * 删除一个角色
   * @param id
   */
  async destroy(id) {
    const { ctx, service } = this;
    const role = await service.role.find(id);
    if (!role) {
      ctx.throw(404, `角色不存在 ${id}`);
    }
    return ctx.model.Role.findByIdAndRemove(id);
  }

  /**
   * 批量删除角色
   * @param ids 需要删除的角色 Id 集合
   */
  async destroyList(ids) {
    return this.ctx.model.Role.remove({ _id: { $in: ids } });
  }

  /**
   * 更新角色
   * @param id
   * @param params
   */
  async update(id, params) {
    const { ctx, service } = this;
    const role = await service.role.find(id);
    if (!role) {
      ctx.throw(404, `角色不存在 ${id}`);
    }
    const temp = await ctx.model.Role.findOne({ title: params.title });
    // 修改时依然要保持不能和现有的数据重复
    if (temp && temp.id !== role.id) {
      if (temp.title === params.title) {
        ctx.throw(409, '角色已存在');
      }
    }
    return service.role.findByIdAndUpdate(id, params);
  }

  /**
   * 获取一个角色
   * @param id
   */
  async show(id) {
    const { ctx, service } = this;
    const role = await service.role.find(id);
    if (!role) {
      ctx.throw(404, `角色不存在 ${id}`);
    }
    return role;
  }

  /**
   * 获取角色列表，可根据参数判断是否分页，搜索
   * @param params 查询参数
   */
  async index(params) {
    const { ctx } = this;
    const { page, limit } = params;
    let result = [];
    let currentCount = 0;
    let totalCount = 0;
    // 计算分页
    const skip = Number(page) * Number(limit || 20);
    // 组装查询参数
    const query = {};

    result = await ctx.model.Role.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .exec();
    currentCount = result.length;
    totalCount = await ctx.model.Role.count(query).exec();

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
   * 通过 Id 查找一个角色
   * @param id
   */
  async find(id) {
    return this.ctx.model.Role.findById(id);
  }

  /**
   * 通过角色身份查找一个角色
   * @param identity
   */
  async findByIdentity(identity) {
    return this.ctx.model.Role.findOne({ identity });
  }

  /**
   * 更新角色信息
   * @param id
   * @param params 需要更新的信息
   */
  async findByIdAndUpdate(id, params) {
    return this.ctx.model.Role.findByIdAndUpdate(id, params, { new: true });
  }

}

module.exports = RoleService;
