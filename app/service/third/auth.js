/**
 * Create by lzan13 2022/03/21
 * 描述：调用三方认证服务
 */
'use strict';

const Service = require('egg').Service;

class AuthService extends Service {
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
   * 实名认证
   */
  async realAuth(idCardNumber, realName) {
    const { app } = this;
    const apiUrl = app.config.thirdApi.apiUrl;
    const data = { idcard: idCardNumber, idNo: idCardNumber, name: realName };
    return await this.apiRequest(apiUrl, 'GET', { Authorization: `APPCODE ${app.config.thirdApi.apiCode}` }, data);
  }

}

module.exports = AuthService;
