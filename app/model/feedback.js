/**
 * Create by lzan13 2020/7/7
 * 描述：用户反馈数据模型
 */
'use strict';
module.exports = app => {
  const mongoose = app.mongoose;

  const FeedbackSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // 反馈用户，可能为空
    contact: { type: String }, // 联系方式，可以使手机号，可以是邮箱
    content: { type: String, required: true }, // 反馈内容
    remark: { type: String }, // 备注信息，可填写处理之后的说明
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // 相关用户
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }, // 相关帖子
    status: { // 处理状态 0-待处理 1-处理中 2-处理完成
      type: Number,
      enum: [ 0, 1, 2 ],
      default: 0,
    },
    attachments: [{ // 附件信息
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Attachment',
    }],
    type: { // 反馈类型 0-意见建议 1-广告引流 2-政治敏感 3-违法违规 4-色情低俗 5-血腥暴力 6-诱导信息 7-谩骂攻击 8-涉嫌诈骗 9-引人不适 10-其他
      type: Number,
      enum: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ],
      default: 0,
    },
  },
  // schema 的选项options
  {
    // id: true, // id: 默认true，Mongoose会默认生成一个虚拟值id,指向数据库的_id，但会转成字符串返回
    timestamps: { createdAt: 'createdAt' }, // 生成时间，记录反馈时间
  });

  return mongoose.model('Feedback', FeedbackSchema);
};
