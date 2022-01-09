/**
 * Create by lzan13 2021/7/2
 * 描述：验证码数据模型
 */
'use strict';
module.exports = app => {
  const mongoose = app.mongoose;

  const CodeSchema = new mongoose.Schema({
    phone: { type: String }, // 手机号
    email: { type: String }, // 邮箱
    code: { type: String }, // 验证码
  },
  // schema 的选项options
  {
    // id: true, // id: 默认true，Mongoose会默认生成一个虚拟值id,指向数据库的_id，但会转成字符串返回
    timestamps: { createdAt: 'createdAt' }, // 生成时间
  });

  return mongoose.model('Code', CodeSchema);
};
