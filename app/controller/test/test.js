/**
 * Create by lzan13 2020/7/7
 * 描述：关注关系对外接口
 */
'use strict';

const Controller = require('egg').Controller;

class TestController extends Controller {

  /**
   * 测试又拍云
   */
  async upyun() {
    const { ctx, service } = this;

    // 组装参数
    const params = ctx.params;

    // 调用 Service 进行业务处理
    await service.third.upyun.dirSize(params.path);

    await service.third.upyun.dirFiles(params.path);

    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: '测试完成' });
  }

}


module.exports = TestController;
