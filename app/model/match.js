/**
 * Create by lzan13 2021/5/7
 * 描述：匹配数据模型
 */
'use strict';
module.exports = app => {
  const mongoose = app.mongoose;

  const MatchSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }, // 用户
    content: { type: String }, // 匹配内容
    fromCount: { type: Number, default: 5 }, // 可供匹配次数
    toCount: { type: Number, default: 0 }, // 被匹配次数
    emotion: { // 匹配时心情 0-开心 1-平淡 2-难过 3-愤怒
      type: Number,
      enum: [ 0, 1, 2, 3 ],
      default: 0,
    },
    gender: { // 性别，方便过滤，对应用户自身性别：0-女，1-男，2-神秘
      type: Number,
      enum: [ 0, 1, 2 ],
      default: 2,
    },
    type: { // 匹配类型 0-心情匹配 1-急速聊天 2-树洞
      type: Number,
      enum: [ 0, 1, 2 ],
      default: 0,
    },
  },
  // schema 的选项options
  {
    // id: true, // id: 默认true，Mongoose会默认生成一个虚拟值id,指向数据库的_id，但会转成字符串返回
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }, // 生成时间
  });

  return mongoose.model('Match', MatchSchema);
};
