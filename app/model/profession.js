/**
 * Create by lzan13 2020/7/7
 * 描述：职业数据模型
 */
'use strict';
module.exports = app => {
  const mongoose = app.mongoose;

  const ProfessionSchema = new mongoose.Schema({
    title: { type: String, unique: true, required: true }, // 职业名称
    desc: { type: String }, // 描述
  },
  // schema 的选项options
  {
    // id: true, // id: 默认true，Mongoose会默认生成一个虚拟值id,指向数据库的_id，但会转成字符串返回
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }, // 生成时间
  });

  return mongoose.model('Profession', ProfessionSchema);
};
