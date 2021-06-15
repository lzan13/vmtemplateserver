/**
 * Create by lzan13 2020/7/7
 * 描述：分类数据模型
 */
'use strict';
module.exports = app => {
  const mongoose = app.mongoose;

  const CategorySchema = new mongoose.Schema({
    // 分类名称
    title: { type: String, unique: true, required: true },
    // 描述
    desc: { type: String },
  },
  // schema 的选项options
  {
    // id: 默认true，Mongoose会默认生成一个虚拟值id,指向数据库的_id，但会转成字符串返回
    id: true,
    // 生成时间
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  });

  return mongoose.model('Category', CategorySchema);
};
