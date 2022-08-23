/**
 * Create by lzan13 2020/7/7
 * 描述：IM数据包数据模型
 */
'use strict';
module.exports = app => {
  const mongoose = app.mongoose;

  const MessageSchema = new mongoose.Schema({
    from: { type: String, index: true }, // 发送者
    to: { type: String, index: true }, // 接收
    chatType: { // 聊天类型 0-单聊 1-群聊 2-聊天室 3-广播
      type: Number,
      enum: [ 0, 1, 2 ],
      default: 0,
    },
    status: { // 消息状态 0-发送中 1-发送成功 2-发送失败 3-离线
      type: Number,
      enum: [ 0, 1, 2, 3 ],
      default: 0,
    },
    type: { // 消息类型 0-文本 1-系统 2-卡片 3-图片 4-语音 5-视频 6-礼物 7-表情
      type: Number,
      enum: [ 0, 1, 2, 3, 4, 5, 6, 7 ],
      default: 0,
    },
    body: { type: String }, // 包内容
    attachments: [{ // 附件信息
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Attachment',
    }],
    extend: { type: String }, // 扩展内容
    localId: { type: String }, // 前端生成的消息Id，由 时间戳+随机数 组成
    time: { type: Number }, // 时间戳
  },
  // schema 的选项options
  {
    // id: true, // id: 默认true，Mongoose会默认生成一个虚拟值id,指向数据库的_id，但会转成字符串返回
    timestamps: { currentTime: () => Date.now(), createdAt: 'time', updatedAt: false }, // 时间戳配置
  });
  /**
   * extend 的几种情况：
   *    位置
   *       longitude 经度
   *       dimensionality 维度
   *       address 地址
   *       image 图片
   *    卡片：
   *       cardType 类型
   *          200 默认卡片
   *          201 业务通知
   *       title 标题
   *       desc 描述
   *       image 图片
   *       url 跳转链接
   */

  return mongoose.model('Message', MessageSchema);
};
