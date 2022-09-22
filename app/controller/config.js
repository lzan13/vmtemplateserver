/**
 * Create by lzan13 2021/7/2
 * 描述：配置对外接口
 */
'use strict';

const Controller = require('egg').Controller;

class ConfigController extends Controller {

  /**
   * 创建
   */
  async create() {
    const { ctx, service } = this;
    // 组装参数
    const params = ctx.params.permit('alias', 'title', 'desc', 'content');
    // 校验参数
    ctx.validate({ alias: 'string', title: 'title', desc: 'desc' }, params);
    // 调用 Service 进行业务处理
    const config = await service.config.create(params);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '创建成功', data: config });
  }

  /**
   * 删除
   */
  async destroy() {
    const { ctx, service } = this;
    // 校验参数
    const { id } = ctx.params;
    // 调用 Service 进行业务处理
    await service.config.destroy(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '删除成功' });
  }

  /**
   * 批量删除
   * 参数 {ids: "5a452a44ab122b16a0231b42,5a452a3bab122b16a0231b41"}
   */
  async destroyList() {
    const { ctx, service } = this;
    // 组装参数
    const { ids } = ctx.params;
    const params = ids.split(',') || [];
    // 调用 Service 进行业务处理
    await service.config.destroyList(params);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '批量删除成功' });
  }
  /**
   * 修改配置
   */
  async update() {
    const { ctx, service } = this;
    // 组装参数
    const { id } = ctx.params;
    const params = ctx.params.permit('alias', 'title', 'desc', 'content');
    // 校验参数
    ctx.validate({ title: 'title?', desc: 'desc?' }, params);
    // 调用 Service 进行业务处理
    const config = await service.config.update(id, params);
    // 如果是客户端配置信息，这里同时更新下内存配置
    if (params.alias === 'appConfig') {
      ctx.common.config = JSON.parse(params.content);
      // console.log(ctx.common.config);
      // 将敏感词解析为 DFA算法 所需Map https://www.jb51.net/article/144351.htm
      ctx.common.sensitiveWordMap = ctx.helper.makeSensitiveMap(ctx.common.config.sensitiveWords);
      // console.log(ctx.common.sensitiveWordMap);
    }

    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '更新成功', data: config });
  }

  /**
   * 获取指定配置信息
   */
  async show() {
    const { ctx, service } = this;
    // 组装参数
    const { id } = ctx.params;
    // 调用 Service 进行业务处理
    const config = await service.config.show(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '获取成功', data: config });
  }

  /**
   * 查询所有配置(分页/模糊)
   */
  async index() {
    const { ctx, service } = this;
    // 组装参数
    const params = ctx.params;
    // 调用 Service 进行业务处理
    const configs = await service.config.index(params);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '查询成功', data: configs });
  }

}


module.exports = ConfigController;
