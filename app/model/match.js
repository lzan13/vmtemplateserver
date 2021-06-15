/**
 * Create by lzan13 2021/5/7
 * 描述：匹配数据模型
 */
'use strict';
module.exports = app => {
  const mongoose = app.mongoose;

  const MatchSchema = new mongoose.Schema({
    // 用户
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // 匹配内容
    content: { type: String },
    // 可供匹配次数
    count: { type: Number, default: 5 },
    // 匹配时心情 0-开心 1-平淡 2-难过
    emotion: {
      type: Number,
      enum: [ 0, 1, 2 ],
      default: 2,
    },
    // 匹配类型 0-普通 1-实时
    type: {
      type: Number,
      enum: [ 0, 1 ],
      default: 0,
    },
  },
  // schema 的选项options
  {
    // id: 默认true，Mongoose会默认生成一个虚拟值id,指向数据库的_id，但会转成字符串返回
    id: true,
    // 生成时间
    timestamps: { createdAt: 'createdAt' },
  });

  return mongoose.model('Match', MatchSchema);
};
