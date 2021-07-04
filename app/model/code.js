/**
 * Create by lzan13 2021/7/2
 * 描述：验证码数据模型
 */
'use strict';
module.exports = app => {
  const mongoose = app.mongoose;

  const CodeSchema = new mongoose.Schema({
    // 手机号
    phone: { type: String },
    // 邮箱
    email: { type: String },
    // 验证码
    code: { type: String },
  },
  // schema 的选项options
  {
    // id: 默认true，Mongoose会默认生成一个虚拟值id,指向数据库的_id，但会转成字符串返回
    id: true,
    // 生成时间
    timestamps: { createdAt: 'createdAt' },
  });

  return mongoose.model('Code', CodeSchema);
};
