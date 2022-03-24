/**
 * Create by lzan13 2022/03/21
 * 描述：MQTT相关控制类
 */
'use strict';

const Controller = require('egg').Controller;

class MQTTController extends Controller {

  /**
   * 获取 MQTT 链接需要的用户 Token
   */
  async userToken() {
    const { ctx, service } = this;

    const params = ctx.params.permit('id');
    const result = await service.third.mqtt.userToken(params.id);
    ctx.helper.success({ ctx, msg: '获取到 token', data: result });
  }

}

module.exports = MQTTController;
