/**
 * Create by lzan13 2021/5/7
 * 描述：匹配数据模型
 */
'use strict';
module.exports = app => {
  const mongoose = app.mongoose;

  const RoomSchema = new mongoose.Schema({
    // 这里指定记录房间 id
    _id: { type: String },
    // 创建者
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // 管理员列表
    managers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    // 成员列表
    members: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    // 标题
    title: { type: String },
    // 描述
    desc: { type: String },
    // 扩展信息
    extension: { type: String },
    // 当前加入人数
    count: { type: Number, default: 1 },
    // 最大人数
    maxCount: { type: Number, default: 500 },
  },
  // schema 的选项options
  {
    // id: 默认true，Mongoose会默认生成一个虚拟值id,指向数据库的_id，但会转成字符串返回
    id: false,
    // 生成时间
    timestamps: { createdAt: 'createdAt' },
  });

  return mongoose.model('Room', RoomSchema);
};
