/**
 * Create by lzan13 2020/7/7
 * 描述：关注关系对外接口
 */
'use strict';

const Controller = require('egg').Controller;

class TestController extends Controller {

  /**
   * 发送邮件
   */
  async sendMail() {
    const { ctx, service } = this;
    // 组装参数
    const params = ctx.params;
    // 调用 Service 进行业务处理
    const result = await service.mail.send(params);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: result ? '发送完成' : '发送失败' });
  }


}


module.exports = TestController;
