/**
 * Create by lzan13 2021/5/19
 * 描述：调用环信 REST API 处理服务
 */
'use strict';

const Service = require('egg').Service;

class EasemobService extends Service {
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
    const apiUrl = `${app.config.easemob.host}/${app.config.easemob.orgName}/${app.config.easemob.appName}/token`;
    const data = {
      grant_type: 'client_credentials',
      client_id: app.config.easemob.clientId,
      client_secret: app.config.easemob.clientSecret,
    };
    const result = await this.apiRequest(apiUrl, 'POST', {}, data);

    const easemob = {};
    if (result.status === 200) {
      easemob.token = result.data.access_token;
      easemob.time = Date.now() / 1000 + result.data.expires_in;
    }
    ctx.common.easemob = easemob;
    return easemob;

  }

  /**
   * 检查 token 是否过期，过期了就重新请求一下缓存起来
   * @return {Promise<void>}
   */
  async checkToken() {
    const { ctx, service } = this;
    let easemob = ctx.common.easemob;
    if (easemob && easemob.token) {
      // 过期 1 分钟前都重新请求
      if (easemob.time > Date.now() / 1000 + 60) {
        return easemob.token;
      }
    }
    easemob = await service.easemob.token();
    return easemob.token;
  }

  /**
   * --------------------------------------------------------------
   * 用户操作
   */
  /**
   * 创建账户
   * @param id 注册到环信的用户 id，对应环信的 username
   * @param password 加密后的账户密码
   */
  async createUser(id, password) {
    const { app, service } = this;
    // 获取 token
    const token = await service.easemob.checkToken();
    if (!token) {
      return false;
    }
    const apiUrl = `${app.config.easemob.host}/${app.config.easemob.orgName}/${app.config.easemob.appName}/users`;
    const data = {
      username: id,
      password,
      nickname: '',
    };
    const result = await this.apiRequest(apiUrl, 'POST', { Authorization: `Bearer ${token}` }, data);

    if (result.status === 200) {
      return true;
    }
    return false;
  }

  /**
   * 删除指定账户
   * @param id 要删除的用户 id，针对环信那边就是 username
   */
  async delUser(id) {
    const { app, service } = this;
    // 获取 token
    const token = await service.easemob.checkToken();
    const apiUrl = `${app.config.easemob.host}/${app.config.easemob.orgName}/${app.config.easemob.appName}/users/${id}`;

    const result = await this.apiRequest(apiUrl, 'DELETE', { Authorization: `Bearer ${token}` }, {});

    if (result.status === 200) {
      return true;
    }
    return false;
  }

  /**
   * 修改用户密码
   * @param id 要删除的用户 id，针对环信那边就是 username
   */
  async updatePassword(id, password) {
    const { app, service } = this;
    // 获取 token
    const token = await service.easemob.checkToken();
    const apiUrl = `${app.config.easemob.host}/${app.config.easemob.orgName}/${app.config.easemob.appName}/users/${id}/password`;
    const result = await this.apiRequest(apiUrl, 'POST', { Authorization: `Bearer ${token}` }, { newpassword: password });

    if (result.status === 200) {
      return true;
    }
    return false;
  }

  /**
   * --------------------------------------------------------------
   * 聊天室操作
   */

  /**
   * 创建聊天室
   * @param title 标题
   * @param desc 描述
   */
  async createRoom(title, desc, owner) {
    const { app, service } = this;
    // 获取 token
    const token = await service.easemob.checkToken();
    if (!token) {
      return '';
    }
    const apiUrl = `${app.config.easemob.host}/${app.config.easemob.orgName}/${app.config.easemob.appName}/chatrooms`;
    const data = {
      name: title,
      description: desc,
      owner,
      maxusers: 500,
    };
    const result = await this.apiRequest(apiUrl, 'POST', { Authorization: `Bearer ${token}` }, data);

    if (result.status === 200) {
      return result.data.data.id;
    }
    return '';
  }

  /**
   * 修改聊天室信息
   * @param roomId 聊天室 Id
   */
  async updateRoom(roomId, title, desc, maxCount = 500) {
    const { app, service } = this;
    // 获取 token
    const token = await service.easemob.checkToken();
    if (!token) {
      return false;
    }
    const apiUrl = `${app.config.easemob.host}/${app.config.easemob.orgName}/${app.config.easemob.appName}/chatrooms/${roomId}`;
    const data = {
      name: title,
      description: desc,
      maxusers: maxCount,
    };
    const result = await this.apiRequest(apiUrl, 'POST', { Authorization: `Bearer ${token}` }, data);

    if (result.status === 200) {
      return true;
    }
    return false;
  }

  /**
   * 销毁聊天室
   * @param roomId 聊天室 Id
   */
  async destroyRoom(roomId) {
    const { app, service } = this;
    // 获取 token
    const token = await service.easemob.checkToken();
    if (!token) {
      return false;
    }
    const apiUrl = `${app.config.easemob.host}/${app.config.easemob.orgName}/${app.config.easemob.appName}/chatrooms/${roomId}`;
    const result = await this.apiRequest(apiUrl, 'DELETE', { Authorization: `Bearer ${token}` }, {});

    if (result.status === 200) {
      return true;
    }
    return false;
  }

  /**
   * 获取聊天室详情
   * @param roomId 聊天室 Id
   */
  async roomInfo(roomId) {
    const { app, service } = this;
    // 获取 token
    const token = await service.easemob.checkToken();
    if (!token) {
      return {};
    }
    const apiUrl = `${app.config.easemob.host}/${app.config.easemob.orgName}/${app.config.easemob.appName}/chatrooms/${roomId}`;
    const result = await this.apiRequest(apiUrl, 'GET', { Authorization: `Bearer ${token}` }, {});

    if (result.status === 200) {
      return result.data.data[0];
    }
    return {};
  }

}

module.exports = EasemobService;
