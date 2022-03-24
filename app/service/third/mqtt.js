/**
 * Create by lzan13 2022/03/21
 * 描述：调用环信 MQTT REST API 处理服务
 */
'use strict';

const Service = require('egg').Service;

class MQTTService extends Service {
  /**
   * 统一进行请求
   * @param url api 地址
   * @param method 请求方式 GET POST DELETE PUT
   * @param customHeaders 自定义请求头
   * @param data 请求参数
   */
  async apiRequest(url, method, customHeaders, data) {
    const headers = {
      'Content-Type': 'application/json',
    };
    Object.assign(headers, customHeaders);
    return await this.ctx.curl(url, {
      method,
      headers,
      data,
      dataType: 'json',
    });
  }

  /**
   * 请求 token
   * {
   *  "access_token": "YWMte3bGuOukEeiTkNP4grL7iwAAAAAAAAAAAAAAAAAAAAGL4CTw6XgR6LaXXVmNX4QCAgMAAAFnKdc-ZgBPGgBFTrLhhyK8woMEI005emtrLJFJV6aoxsZSioSIZkr5kw",
   *  "expires_in": 5184000,
   *  "application": "8be024f0-e978-11e8-b697-5d598d5f8402"
   * }
   * @param params
   */
  async token() {
    const { app, ctx } = this;
    const apiUrl = `${app.config.mqtt.restHost}/openapi/rm/app/token`;
    const data = {
      appClientId: app.config.mqtt.clientId,
      appClientSecret: app.config.mqtt.clientSecret,
    };
    const result = await this.apiRequest(apiUrl, 'POST', {}, data);

    const mqtt = {};
    if (result.status === 200) {
      mqtt.token = result.data.body.access_token;
      mqtt.time = Date.now() / 1000 + result.data.body.expires_in;
    }
    ctx.common.mqtt = mqtt;
    return mqtt;

  }

  /**
   * 检查 token 是否过期，过期了就重新请求一下缓存起来
   * @return {Promise<void>}
   */
  async checkToken() {
    const { ctx } = this;
    let mqtt = ctx.common.mqtt;
    if (mqtt && mqtt.token) {
      // 过期 1 分钟前都重新请求
      if (mqtt.time > Date.now() / 1000 + 60) {
        return mqtt.token;
      }
    }
    mqtt = await this.token();
    return mqtt.token;
  }

  /**
   * --------------------------------------------------------------
   * 用户操作
   */
  /**
   * 获取 MQTT 链接需要的用户 Token
   * @return {Promise<void>}
   */
  async userToken(id) {
    const { app } = this;
    // 获取 token
    const token = await this.checkToken();
    if (!token) {
      return '';
    }
    const apiUrl = `${app.config.mqtt.restHost}/openapi/rm/user/token`;
    const data = {
      username: id,
      cid: `${id}@${app.config.mqtt.appId}`,
    };
    const result = await this.apiRequest(apiUrl, 'POST', { Authorization: ` ${token}` }, data);
    if (result.status === 200) {
      return result.data.body.access_token;
    }
    return '';
  }

}

module.exports = MQTTService;
