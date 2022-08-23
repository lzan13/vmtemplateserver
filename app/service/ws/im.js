/**
 * Create by lzan13 2022/08/05
 * 描述：IM 服务处理
 */
'use strict';
const Service = require('egg').Service;

class IMService extends Service {

  /**
   * 链接建立
   */
  async connect() {
    const { app, ctx, service } = this;

    const { token, userId } = ctx.socket.handshake.query;
    // 判断 token 是否有效，无效则踢出用户
    const result = await service.token.verify(token);
    if (!result.verify) {
      // token 校验失败，直接断开链接
      ctx.socket.disconnect();
      return;
    }

    // 保存 socket 缓存
    const expires = 7 * 24 * 60 * 60;// 设置有效期时长，防止一直存在，内存暴增
    const key = `socket_${userId}`;
    await app.redis.set(key, ctx.socket.id, 'EX', expires);

    console.log(`-lz-connect ${userId}`);

    const beginTime = Date.now();
    const endTime = beginTime - 7 * 24 * 60 * 60 * 1000;
    await this.checkOfflineMessage(0, beginTime, endTime);
  }

  /**
   * 检查离线消息，然后重新投递，这里可能会递归调用
   */
  async checkOfflineMessage(page, beginTime, endTime) {
    const { ctx, service } = this;
    const { userId } = ctx.socket.handshake.query;
    const params = { page, limit: 50, beginTime, endTime, to: userId, status: 3 };
    const result = await service.ws.message.index(params);
    if (result.currentCount > 0) {
      await this.sendMessage(userId, result.data);
      // 还有更多，递归调用
      if (result.totalCount > result.page * result.limit + result.currentCount) {
        await this.checkOfflineMessage(page++, beginTime, endTime);
      }
    }
  }

  /**
   * 链接断开
   */
  async disconnect() {
    const { app, ctx } = this;

    const { userId } = ctx.socket.handshake.query;

    // 断开链接后，删除 socket 缓存
    const key = `socket_${userId}`;
    await app.redis.del(key);

    console.log(`-lz-disconnect ${userId}`);
  }

  /**
   * 收到数据包
   */
  async receiveData(type, data, callback) {
    switch (type) {
      case 'message':
        await this.handleMessage(data, callback);
        break;
      case 'signal':
        await this.handleSignal(data, callback);
        break;
      default:
        break;
    }
  }

  /**
   * 处理消息包
   */
  async handleMessage(data, ack) {
    const { service } = this;
    // 这里这么做是为了保持和查询消息的结构一致性，也为了消息有个唯一的ID
    let message = await service.ws.message.create(data);
    message = await service.ws.message.find(message.id);
    // 回复 ack
    if (!data.from || !data.to || !data.body) {
      ack && ack(402, '参数错误');
    } else {
      ack && ack(0, message);
    }
    // 将消息投递出去
    this.sendMessage(message.to, [ message ]);
  }

  /**
   * 发送消息
   */
  async sendMessage(chatId, messages) {
    const { app } = this;
    // 查找接收方 socket
    const key = `socket_${chatId}`;
    const socketId = await app.redis.get(key);
    const socket = app.io.of('/').sockets[socketId];
    if (socketId && socket) {
      // 设置定时器
      const timer = setTimeout(() => {
        clearTimeout(timer);
        console.log('-lz-消息发送失败 timeout');
        // 更新消息状态
        this.updateMessageStatus(3, messages);
      }, 5000);
      socket.emit('message', messages, (code, obj) => {
        clearTimeout(timer);
        if (code === 0) {
          console.log(`-lz-消息发送成功 ${obj}`);
          this.updateMessageStatus(1, messages);
        } else {
          console.log(`-lz-消息发送失败 ${code}`);
          // 更新消息状态
          this.updateMessageStatus(3, messages);
        }
      });

    } else {
      console.log('-lz-消息发送失败 user is not online');
      // 未能投递，将消息标注离线
      this.updateMessageStatus(3, messages);
    }
  }

  /**
   * 更新消息状态
   */
  async updateMessageStatus(status, messages) {
    const ids = messages.map(message => { return message.id; });
    const query = { _id: { $in: ids } };
    const params = { status };
    this.service.ws.message.updateByQuery(query, params);
  }

  /**
   * 处理信令包
   */
  async handleSignal(data, ack) {
    // const { app, ctx, service } = this;
    // 回复 ack
    if (!data.action || !data.from || !data.to) {
      ack && ack(402, '参数错误');
    } else {
      ack && ack(0, '');
    }

    switch (data.action) {
      case 'onlineStatus': // 在线状态
        this.onlineStatus(data);
        break;
      case 'recallMessage': // 撤回消息
        this.recallMessage(data);
        break;
      default:
        // 将信令投递出去
        this.sendSignal(data);
        break;
    }
  }

  /**
   * 发送信令
   */
  async sendSignal(signal) {
    const { app } = this;
    if (signal.time === '') {
      signal.time = Date.now();
    }
    if (signal.chatType === 3) {
      // 这里要广播给所有人
      app.io.of('/')
        .emit('signal', signal);
    } else {
      // 查找接收方 socket
      const key = `socket_${signal.to}`;
      const socketId = await app.redis.get(key);
      if (socketId) {
        app.io.of('/').sockets[socketId].emit('signal', signal);
        console.log('-lz-信令发送成功');
      } else {
        console.log('-lz-信令发送失败 user is not online');
      }
    }
  }

  /**
   * 在线状态
   */
  async onlineStatus(signal) {
    // const { app, ctx, service } = this;
    console.log(`-lz- onlineStatus ${signal}`);
  }

  /**
   * 撤回消息
   */
  async recallMessage(signal) {
    const { service } = this;
    // const { app, ctx, service } = this;
    console.log(`-lz- recallMessage ${signal}`);
    // 找到这条消息
    const message = await service.ws.message.find(signal.id);
    if (message) {
      // 处理消息，这里讲消息类型设置为 1-系统消息 扩展类型设置为 101-撤回消息
      message.type = 1;
      const extend = message.extend ? JSON.parse(message.extend) : {};
      extend.extType = 101;
      await service.ws.message.findByIdAndUpdate(signal.id, { extend: JSON.stringify(extend) });
      // 下发撤回后的消息
      message.extend = JSON.stringify(extend);
      this.sendMessage(message.to, [ message ]);
    }
  }
}

module.exports = IMService;
