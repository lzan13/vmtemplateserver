/**
 * Create by lzan13 2020/7/7
 * 描述：评论数据模型
 */
'use strict';
module.exports = app => {
  const mongoose = app.mongoose;

  const CommentSchema = new mongoose.Schema({
    // 评论者
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    // 被评论的帖子
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    // 被评论者
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // 评论内容
    content: { type: String, required: true },
    // 被喜欢数量
    likeCount: { type: Number, default: 0 },
  },
  // schema 的选项options
  {
    // id: 默认true，Mongoose会默认生成一个虚拟值id,指向数据库的_id，但会转成字符串返回
    id: true,
    // 生成时间
    timestamps: { createdAt: 'createdAt' },
  });

  return mongoose.model('Comment', CommentSchema);
};
