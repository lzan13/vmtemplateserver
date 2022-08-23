/**
 * Create by lzan13 2022/8/3
 * 描述：Socket.io 处理器
 */
'use strict';

const Controller = require('egg').Controller;

class IMController extends Controller {

  /**
   * 收到消息包
   */
  async message() {
    const { ctx, service } = this;
    await service.ws.im.receiveData('message', JSON.parse(ctx.args[0]), ctx.args[1]);
  }

  /**
   * 收到信令包
   */
  async signal() {
    const { ctx, service } = this;
    await service.ws.im.receiveData('signal', JSON.parse(ctx.args[0]), ctx.args[1]);
  }
}

module.exports = IMController;
