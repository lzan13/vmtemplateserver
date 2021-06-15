/**
 * Create by lzan13 2020/7/7
 * 描述：用户反馈数据模型
 */
'use strict';
module.exports = app => {
  const mongoose = app.mongoose;

  const FeedbackSchema = new mongoose.Schema({
    // 联系方式，可以使手机号，可以是邮箱
    contact: { type: String },
    // 反馈内容
    content: { type: String, required: true },
    // 附件信息
    attachments: { type: mongoose.Schema.Types.ObjectId, ref: 'Attachment' },
  },
  // schema 的选项options
  {
    // id: 默认true，Mongoose会默认生成一个虚拟值id,指向数据库的_id，但会转成字符串返回
    id: true,
    // 生成时间，记录反馈时间
    timestamps: { createdAt: 'createdAt' },
  });

  return mongoose.model('Feedback', FeedbackSchema);
};
