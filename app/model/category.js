/**
 * Create by lzan13 2020/7/7
 * 描述：分类数据模型
 */
'use strict';
module.exports = app => {
  const mongoose = app.mongoose;

  const CategorySchema = new mongoose.Schema({
    title: { type: String, unique: true, required: true }, // 分类名称
    desc: { type: String }, // 描述
    createdAt: { type: Number },
    updatedAt: { type: Number },
  },
  // schema 的选项options
  {
    // id: true, // id: 默认true，Mongoose会默认生成一个虚拟值id,指向数据库的_id，但会转成字符串返回
    timestamps: { currentTime: () => Date.now(), createdAt: true, updatedAt: true }, // 时间戳配置
  });

  return mongoose.model('Category', CategorySchema);
};
