/**
 * Create by lzan13 2020/8/24
 * 描述：消息数据模型
 * {
 *    from: '5f22686990c2d0216c812f00', // 发送者
 *    to: '5f4479a85ca297c49cfe7547', // 接受者
 *    dataType: 2, // 消息类型 0-命令类型 1-系统消息 2-普通消息
 *    mediaType: 1, // 消息类型 1-文本 2-大表情 3-图片 4-语音 5-视频 6-文件 7-卡片 8-位置 9-自定义 自定义内容包含在 extend 中
 *    content: '123123', // 内容
 *    extend: {'key': 'value'} // 消息扩展
 *    time:156234234231, // 时间戳
 * }
 */
'use strict';
module.exports = app => {
  const mongoose = app.mongoose;

  const DataSchema = new mongoose.Schema({
    // 消息发送方
    from: { type: String },
    // 消息接受方
    to: { type: String },
    // 数据包类型 0-命令 1-系统通知 2-普通消息
    dataType: {
      type: Number,
      enum: [ 0, 1, 2 ],
      default: 2,
    },
    // 消息类型，数据包类型为 2 时生效
    // 1-文本 2-大表情 3-图片 4-语音 5-视频 6-文件 7-卡片 8-位置 9-自定义 自定义内容包含在 extend 中
    mediaType: {
      type: Number,
      enum: [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ],
      default: 1,
    },
    // 内容
    content: { type: String },
    // 扩展
    extend: { type: String },
    // 时间戳
    time: { type: String },
  },
  // schema 的选项options
  {
    // id: 默认true，Mongoose会默认生成一个虚拟值id,指向数据库的_id，但会转成字符串返回
    id: true,
  });

  return mongoose.model('Data', DataSchema);
};
