/**
 * Create by lzan13 2022/05/24
 * 描述：程序包信息处理服务
 */
'use strict';

const Service = require('egg').Service;

class AppletService extends Service {

  /**
   * 创建
   * @param params
   */
  async create(params) {
    const { ctx } = this;
    const identity = ctx.state.user.identity;
    if (identity < 700) {
      ctx.throw(403, '无权操作');
    }
    if (!params.cover || params.cover === '') {
      delete params.cover;
    }
    if (!params.body || params.body === '') {
      delete params.body;
    }
    return await ctx.model.Applet.create(params);
  }

  /**
   * 删除
   * @param id
   */
  async destroy(id) {
    const { ctx, service } = this;
    // 先判断下权限
    const identity = ctx.state.user.identity;
    if (identity < 700) {
      ctx.throw(403, '无权操作');
    }
    const applet = await service.applet.find(id);
    if (!applet) {
      ctx.throw(404, `数据不存在 ${id}`);
    }
    // 删除封面
    service.attachment.destroy(applet.cover);
    // 删除程序包数据
    service.attachment.destroy(applet.body);
    // 删除
    return ctx.model.Applet.findByIdAndRemove(id);
  }

  /**
   * 更新内容
   * @param id
   * @param params
   */
  async update(id, params) {
    const { ctx, service } = this;
    // 先判断下权限
    const identity = ctx.state.user.identity;
    if (identity < 700) {
      ctx.throw(403, '无权操作');
    }
    const applet = await service.applet.find(id);
    if (!applet) {
      ctx.throw(404, '数据不存在');
    }
    if (params.cover) {
      if (applet.cover && applet.cover.id !== params.cover) {
        service.attachment.destroy(params.cover);
      }
    } else {
      delete params.cover;
    }
    if (params.body) {
      if (applet.body && applet.body.id !== params.body) {
        service.attachment.destroy(params.body);
      }
    } else {
      delete params.body;
    }
    return service.applet.findByIdAndUpdate(id, params);
  }

  /**
   * 获取一个内容
   * @param id
   */
  async show(id) {
    const { ctx, service } = this;
    const applet = await service.applet.find(id);
    if (!applet) {
      ctx.throw(404, `数据不存在 ${id}`);
    }
    return applet;
  }

  /**
   * 获取数据列表，可根据参数判断是否分页，搜索
   * @param params 查询参数
   */
  async index(params) {
    const { ctx } = this;
    const { page, limit } = params;
    let result = [];
    let currentCount = 0;
    let totalCount = 0;
    // 计算分页
    const skip = Number(page || 0) * Number(limit || 20);
    // 组装查询参数
    const query = {};

    result = await ctx.model.Applet.find(query)
      .skip(skip)
      .populate('cover', { path: 1, space: 1, width: 1, height: 1 })
      .populate('body', { extname: 1, path: 1, space: 1 })
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .exec();
    currentCount = result.length;
    totalCount = await ctx.model.Applet.countDocuments(query).exec();

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
    return this.ctx.model.Applet.findById(id)
      .populate('cover', { path: 1, space: 1, width: 1, height: 1 })
      .populate('body', { path: 1, space: 1 })
      .exec();
  }

  /**
   * 更新
   * @param id
   * @param params 需要更新的信息
   */
  async findByIdAndUpdate(id, params) {
    return this.ctx.model.Applet.findByIdAndUpdate(id, params);
  }

}

module.exports = AppletService;
