/**
 * Create by lzan13 2020/7/7
 * 描述：通知数据模型
 * TODO 这里后续需要加上定时任务，通知类数据只保留 7 天或者一个月
 */
'use strict';
module.exports = app => {
  const mongoose = app.mongoose;

  const NoticeSchema = new mongoose.Schema({
    // 触发者
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // 被评论者
    toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    // 被评论的帖子
    toPost: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    // 被评论的评论
    toComment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
    // 通知内容
    content: { type: String },
    /**
     * 通知类型
     * 0-系统公告，
     * 1-有人关注我，
     * 2-有人喜欢我，
     * 3-有人喜欢我的帖子，
     * 4-有人喜欢我的评论，
     * 5-评论我的帖子，
     * 6-评论我的评论，
     */
    type: {
      type: Number,
      enum: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ],
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

  return mongoose.model('Notice', NoticeSchema);
};
