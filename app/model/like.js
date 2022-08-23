/**
 * Create by lzan13 2020/7/7
 * 描述：喜欢数据模型
 */
'use strict';
module.exports = app => {
  const mongoose = app.mongoose;

  const LikeSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }, // 发起喜欢用户
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }, // 被喜欢的用户
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', index: true }, // 被喜欢的帖子
    comment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }, // 被喜欢的评论
    type: { // 喜欢类型 0-用户，1-帖子，2-评论
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
    timestamps: { currentTime: () => Date.now(), createdAt: true, updatedAt: false }, // 时间戳配置
  });

  return mongoose.model('Like', LikeSchema);
};
