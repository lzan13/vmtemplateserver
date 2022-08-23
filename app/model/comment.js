/**
 * Create by lzan13 2020/7/7
 * 描述：评论数据模型
 */
'use strict';
module.exports = app => {
  const mongoose = app.mongoose;

  const CommentSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }, // 评论者
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }, // 被评论的帖子
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // 被评论者
    content: { type: String, required: true }, // 评论内容
    status: { // 审核状态，前期默认直接通过，有需求时可以改成默认待审核 0-通过 1-待审核 2-拒绝
      type: Number,
      enum: [ 0, 1, 2 ],
      default: 0,
    },
    likeCount: { type: Number, default: 0 }, // 被喜欢数量
    createdAt: { type: Number },
  },
  // schema 的选项options
  {
    // id: true, // id: 默认true，Mongoose会默认生成一个虚拟值id,指向数据库的_id，但会转成字符串返回
    timestamps: { currentTime: () => Date.now(), createdAt: true, updatedAt: false }, // 时间戳配置
  });

  return mongoose.model('Comment', CommentSchema);
};
