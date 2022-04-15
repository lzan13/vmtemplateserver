/**
 * Create by lzan13 2020/7/7
 * 描述：发布数据模型
 */
'use strict';
module.exports = app => {
  const mongoose = app.mongoose;

  const PostSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }, // 发布者
    title: { type: String }, // 标题
    content: { type: String }, // 内容
    status: { // 审核状态，前期默认直接通过，有需求时可以改成默认待审核 0-通过 1-待审核 2-拒绝
      type: Number,
      enum: [ 0, 1, 2 ],
      default: 0,
    },
    stick: { // 置顶状态 0-不置顶 1-个人置顶 2-全局置顶
      type: Number,
      enum: [ 0, 1, 2 ],
      default: 0,
    },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }, // 分类信息
    attachments: [{ // 附件信息
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Attachment',
    }],
    commentCount: { type: Number, default: 0 }, // 被评论数量
    likeCount: { type: Number, default: 0 }, // 被喜欢数量
    deleted: { type: Number, enum: [ 0, 1 ], default: 0 }, // 记录是否被删除，只是软删除 0-未删除 1-已删除
    deletedAt: { type: Date }, // 删除 时间
  },
  // schema 的选项options
  {
    // id: true, // id: 默认true，Mongoose会默认生成一个虚拟值id,指向数据库的_id，但会转成字符串返回
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }, // 生成时间
  });

  return mongoose.model('Post', PostSchema);
};
