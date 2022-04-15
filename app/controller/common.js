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
    // TODO 老版本 API 查询版本更新信息是通过平台名，做个兼容
    let version;
    if (platform === 'android') {
      version = await service.version.findByPlatform(0);
    } else {
      version = await service.version.findByPlatform(platform);
    }
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '版本检查成功', data: version });
  }

  /**
   * 获取客户端配置信息
   */
  async clientConfig() {
    const { ctx, service } = this;
    const config = await service.config.findByAlias('client');
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '获取配置信息成功', data: config });
  }

  /**
   * 获取隐私政策
   */
  async privatePolicy() {
    const { ctx, service } = this;
    const config = await service.config.findByAlias('policy');
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '获取隐私政策成功', data: config });
  }

  /**
   * 获取用户协议
   */
  async userAgreement() {
    const { ctx, service } = this;
    const config = await service.config.findByAlias('agreement');
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '获取用户协议成功', data: config });
  }

  /**
   * 获取用户行为规范
   */
  async userNorm() {
    const { ctx, service } = this;
    const config = await service.config.findByAlias('norm');
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '获取用户行为规范成功', data: config });
  }

  /**
   * 提交反馈信息
   */
  async feedback() {
    const { ctx, service } = this;
    // 组装参数
    const params = ctx.params.permit('contact', 'content', 'user', 'post', 'remark', 'attachments', 'type');
    if (!params.user) {
      delete params.user;
    }
    if (!params.post) {
      delete params.post;
    }

    // 校验参数
    ctx.validate({ content: 'content' }, params);
    // 调用 Service 进行业务处理
    const feedback = await service.feedback.create(params);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '反馈成功', data: feedback });
  }

  /**
   * 反馈列表，这里只能查询和自己相关的
   */
  async feedbackList() {
    const { ctx, service } = this;
    // 组装参数
    const params = ctx.params;
    if (!params.owner && ctx.state.user && ctx.state.user.id) {
      params.owner = ctx.state.user.id;
    }
    // 调用 Service 进行业务处理
    const feedbacks = await service.feedback.index(params);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '获取反馈数据', data: feedbacks });
  }

  /**
   * 获取虚拟商品列表
   */
  async virtualCommodityList() {
    const { ctx, service } = this;
    // 调用 Service 进行业务处理
    const role = await service.commodity.index({ page: 0, limit: 20, extend: { $or: [{ type: 0 }, { type: 1 }] } });
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '获取商品数据成功', data: role });
  }


}


module.exports = CommonController;
