/**
 * Create by lzan13 2021/5/7
 * 描述：匹配数据模型
 */
'use strict';
module.exports = app => {
  const mongoose = app.mongoose;

  const RoomSchema = new mongoose.Schema({
    _id: { type: String }, // 这里指定记录房间 id
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // 创建者
    managers: [{ // 管理员列表
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    members: [{ // 成员列表
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    title: { type: String }, // 标题
    desc: { type: String }, // 描述
    type: { // 房间类型 0-普通聊天 1-你画我猜 2-谁是卧底
      type: Number,
      enum: [ 0, 1, 2 ],
      default: 0,
    },
    count: { type: Number, default: 1 }, // 当前加入人数
    maxCount: { type: Number, default: 500 }, // 最大人数
    extension: { type: String }, // 扩展信息
  },
  // schema 的选项options
  {
    // id: true, // id: 默认true，Mongoose会默认生成一个虚拟值id,指向数据库的_id，但会转成字符串返回
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }, // 生成时间
  });

  return mongoose.model('Room', RoomSchema);
};
