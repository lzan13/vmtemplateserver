/**
 * Create by lzan13 2020/07/06.
 * 描述：用户信息处理服务
 */
'use strict';

const Service = require('egg').Service;

const roleSelect = { title: 1, desc: 1, identity: 1 };
const professionSelect = { title: 1, desc: 1 };

class UserService extends Service {

  /**
   * 创建用户
   * @param params 参数信息
   */
  async create(params) {
    const { ctx, service } = this;
    let role = await service.role.find(params.roleId);
    if (!role) {
      role = await service.role.findByIdentity(9);
      if (!role) {
        ctx.throw(404, '角色不存在');
      }
    }
    params.role = role._id;
    // 密码加密，这里是简单的 md5 加密
    params.password = await ctx.helper.cryptoMD5(params.password);
    const user = await ctx.model.User.create(params);

    const result = await service.easemob.createUser(user.id, user.password);
    if (result) {
      return user;
    }
    // 删除用户并返回
    return ctx.model.User.findByIdAndRemove(user.id);
  }

  /**
   * 销毁单个用户，这里的销毁是物理删除，从数据库删除用户全部信息
   * @param id 账户 Id
   */
  async destroy(id) {
    const { ctx, service } = this;
    const user = await service.user.find(id);
    if (!user) {
      ctx.throw(404, `用户不存在 ${id}`);
    }
    // 删除用户名下的帖子
    await ctx.model.Post.deleteMany({ owner: this.app.mongoose.Types.ObjectId(user.id) });

    // 删除环信账户
    const result = await service.easemob.delUser(user.id);

    // 删除用户并返回
    return ctx.model.User.findByIdAndRemove(id);
  }

  /**
   * 删除单个用户，这里的销毁是软删除，将用户状态改为删除
   * @param params
   */
  async delete(id, reason) {
    const { ctx, service } = this;
    const user = await service.user.find(id);
    if (!user) {
      ctx.throw(404, `用户不存在 ${id}`);
    }
    const data = {
      deleted: 1,
      deletedReason: reason,
    };
    return service.user.findByIdAndUpdate(id, data);
  }

  /**
   * 更新用户信息
   *
   * @param id 用户 Id
   * @param params 需要更新的信息
   */
  async update(id, params) {
    const { ctx, service } = this;
    const user = await service.user.find(id);
    if (!user) {
      ctx.throw(404, `用户不存在 ${id}`);
    }
    return service.user.findByIdAndUpdate(id, params);
  }

  /**
   * 获取单个用户
   * @param id 用户 Id
   */
  async show(id) {
    const { ctx, service } = this;
    const user = await service.user.find(id, { password: 0, token: 0 });
    if (!user) {
      ctx.throw(404, `用户不存在 ${id}`);
    }
    return user;
  }

  /**
   * 查询用户列表，可根据参数判断是否分页，搜索
   * @param params 查询参数
   */
  async index(params) {
    const { ctx, service } = this;
    const { page, limit, email, phone, profession, deleted } = params;
    let result = [];
    let currentCount = 0;
    let totalCount = 0;
    // 计算分页
    const skip = Number(page) * Number(limit || 20);
    // 组装查询参数
    const query = { deleted: Number(deleted) || 0 };
    if (email) {
      query.email = email;
    }
    if (phone) {
      query.phone = phone;
    }
    if (profession) {
      query.profession = profession;
    }
    const role = await service.role.findByIdentity(8);
    if (role) {
      query.role = role.id;
    }
    result = await ctx.model.User.find(query, {
      password: 0,
      token: 0,
      code: 0,
      idCardNumber: 0,
      realName: 0,
    })
      .populate('profession', professionSelect)
      .populate('role', roleSelect)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .exec();
    currentCount = result.length;
    totalCount = await ctx.model.User.count(query)
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
   * 通过 Id 查找用户
   * @param id 用户 Id
   * @param select 包含或屏蔽某些字段
   */
  async find(id, select = {}) {
    return this.ctx.model.User.findById(id, select)
      .populate('profession', professionSelect)
      .populate('role', roleSelect)
      .exec();
  }

  /**
   * 通过条件查询用户
   * @param query 查询条件
   */
  async findByQuery(query) {
    return this.ctx.model.User.findOne(query)
      .populate('profession', professionSelect)
      .populate('role', roleSelect)
      .exec();
  }

  /**
   * 通过设备 Id 查找用户
   * @param devicesId 设备 Id
   */
  async findByDevicesId(devicesId) {
    return this.ctx.model.User.findOne({ devicesId });
  }

  /**
   * 通过邮箱查找用户
   * @param email 邮箱地址
   */
  async findByEmail(email) {
    return this.ctx.model.User.findOne({ email })
      .populate('profession', professionSelect)
      .populate('role', roleSelect)
      .exec();
  }

  /**
   * 通过手机号查找用户
   * @param phone 手机号
   */
  async findByPhone(phone) {
    return this.ctx.model.User.findOne({ phone })
      .populate('profession', professionSelect)
      .populate('role', roleSelect)
      .exec();
  }

  /**
   * 通过 Id 查找用户
   * @param token 用户token
   */
  async findByToken(token) {
    return this.ctx.model.User.findOne({ token })
      .populate('profession', professionSelect)
      .populate('role', roleSelect)
      .exec();
  }

  /**
   * 更新用户信息
   * @param id 用户 Id
   * @param params 需要更新的信息
   */
  async findByIdAndUpdate(id, params) {
    return this.ctx.model.User.findByIdAndUpdate(id, params);
  }

  /**
   * 更新用户信息
   * @param query 查询条件
   * @param params 需要更新的信息
   */
  async findOneAndUpdate(query, params) {
    return this.ctx.model.User.findOneAndUpdate(query, params);
  }
}

module.exports = UserService;
