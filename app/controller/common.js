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
    ctx.helper.success({ ctx, msg: '检查结果', data: version });
  }

  /**
   * 获取客户端配置信息
   */
  async clientConfig() {
    const { ctx, service } = this;
    const config = await service.config.findByAlias('clientConfig');
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '检查结果', data: config });
  }

  /**
   * 获取隐私政策
   */
  async privatePolicy() {
    const { ctx, service } = this;
    const config = await service.config.findByAlias('policy');
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '获取配置成功', data: config });
  }

  /**
   * 获取用户协议
   */
  async userAgreement() {
    const { ctx, service } = this;
    const config = await service.config.findByAlias('agreement');
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '获取配置成功', data: config });
  }

  /**
   * 提交反馈信息
   */
  async feedback() {
    const { ctx, service } = this;
    // 组装参数
    const params = ctx.params.permit('contact', 'content', 'user', 'post', 'remark', 'attachments', 'type');
    // 校验参数
    ctx.validate({ content: 'content', type: 'int' }, params);
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
   * 商品列表，这里只能查询正常商品
   */
  async commodityList() {
    const { ctx, service } = this;
    // 组装参数
    const params = ctx.params.permit('page', 'limit', 'type');
    // 这个接口只能查正常上架商品
    params.status = 1;
    // 调用 Service 进行业务处理
    const role = await service.commodity.index(params);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '获取商品数据成功', data: role });
  }


}


module.exports = CommonController;
