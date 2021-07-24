/**
 * Create by lzan13 2020/7/7
 * 描述：公共对外接口
 */
'use strict';

const Controller = require('egg').Controller;

class CommonController extends Controller {

  /**
   * 获取分类列表
   */
  async category() {
    const { ctx, service } = this;
    // 组装参数
    const params = ctx.params;
    // 调用 Service 进行业务处理
    const categorys = await service.category.index(params);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '查询分类成功', data: categorys });
  }

  /**
   * 获取职业列表
   */
  async profession() {
    const { ctx, service } = this;
    // 组装参数
    const params = ctx.params;
    // 调用 Service 进行业务处理
    const professions = await service.profession.index(params);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '查询职业成功', data: professions });
  }

  /**
   * 检查版本信息
   */
  async checkVersion() {
    const { ctx, service } = this;
    const { platform } = ctx.params.permit('platform');
    const version = await service.version.findByPlatform(platform);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '检查结果', data: version });
  }

  /**
   * 获取客户端配置信息
   */
  async getClientConfig() {
    const { ctx, service } = this;
    const version = await service.config.findByAlias('clientConfig');
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '检查结果', data: version });
  }

  /**
   * 获取隐私政策
   */
  async getPrivatePolicy() {
    const { ctx, service } = this;
    const config = await service.config.findByAlias('privatePolicy');
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '获取配置成功', data: config });
  }

  /**
   * 获取用户协议
   */
  async getUserAgreement() {
    const { ctx, service } = this;
    const config = await service.config.findByAlias('userAgreement');
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '获取配置成功', data: config });
  }


}


module.exports = CommonController;
