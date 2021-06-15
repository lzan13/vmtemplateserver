/**
 * Create by lzan13 2020/7/7
 * 描述：发布数据模型
 */
'use strict';
module.exports = app => {
  const mongoose = app.mongoose;

  const PostSchema = new mongoose.Schema({
    // 发布者
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    // 标题
    title: { type: String, required: true },
    // 内容
    content: { type: String },
    // 置顶状态 0-不置顶 1-个人置顶 2-全局置顶
    stick: {
      type: Number,
      enum: [ 0, 1, 2 ],
      default: 0,
    },
    // 分类信息
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    // 附件信息
    attachments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Attachment',
    }],
    // 被评论数量
    commentCount: { type: Number, default: 0 },
    // 被喜欢数量
    likeCount: { type: Number, default: 0 },
    // 记录是否被删除，只是软删除 0-未删除 1-已删除
    deleted: { type: Number, enum: [ 0, 1 ], default: 0 },
    // 删除 时间
    deletedAt: { type: Date },
  },
  // schema 的选项options
  {
    // id: 默认true，Mongoose会默认生成一个虚拟值id,指向数据库的_id，但会转成字符串返回
    id: true,
    // 生成时间
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  });

  return mongoose.model('Post', PostSchema);
};
