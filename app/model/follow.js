/**
 * Create by lzan13 2020/7/7
 * 描述：关注数据模型
 */
'use strict';
module.exports = app => {
  const mongoose = app.mongoose;

  const FollowSchema = new mongoose.Schema({
    // 用户1
    user1: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    // 用户2
    user2: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    // 相互关系：-1-无关 数据不会存在 0-A_>B，1-B->A，2-A<->B
    relation: {
      type: Number,
      enum: [ 0, 1, 2 ],
      default: 0,
    },
  },
  // schema 的选项options
  {
    // id: 默认true，Mongoose会默认生成一个虚拟值id,指向数据库的_id，但会转成字符串返回
    id: true,
    // 生成时间
    timestamps: { createdAt: 'createdAt' },
  });

  return mongoose.model('Follow', FollowSchema);
};
