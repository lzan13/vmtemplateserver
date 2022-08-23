/**
 * Create by lzan13 2021/11/18
 * 描述：礼物收取记录数据模型
 */
'use strict';
module.exports = app => {
  const mongoose = app.mongoose;

  const GiftRelationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }, // 用户
    gift: { type: mongoose.Schema.Types.ObjectId, ref: 'Gift', index: true }, // 礼物
    count: { type: Number }, // 数量
    createdAt: { type: Number },
    updatedAt: { type: Number },
  },
  // schema 的选项options
  {
    // id: true, // id: 默认true，Mongoose会默认生成一个虚拟值id,指向数据库的_id，但会转成字符串返回
    timestamps: { currentTime: () => Date.now(), createdAt: true, updatedAt: true }, // 时间戳配置
  });

  return mongoose.model('GiftRelation', GiftRelationSchema);
};
