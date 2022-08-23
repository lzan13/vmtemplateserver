/**
 * Create by lzan13 2022/04/07
 * 描述：黑名单数据模型
 */
'use strict';
module.exports = app => {
  const mongoose = app.mongoose;

  const BlacklistSchema = new mongoose.Schema({
    user1: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }, // 用户1
    user2: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }, // 用户2
    relation: { // 相互关系：-1-无关 数据不会存在 0-A->B，1-B->A，2-A<->B
      type: Number,
      enum: [ 0, 1, 2 ],
      default: 0,
    },
    createdAt: { type: Number },
    updatedAt: { type: Number },
  },
  // schema 的选项options
  {
    // id: true, // id: 默认true，Mongoose会默认生成一个虚拟值id,指向数据库的_id，但会转成字符串返回
    timestamps: { currentTime: () => Date.now(), createdAt: true, updatedAt: true }, // 时间戳配置
  });

  return mongoose.model('Blacklist', BlacklistSchema);
};
