/**
 * Create by lzan13 2021/11/18
 * 描述：礼物数据模型
 */
'use strict';
module.exports = app => {
  const mongoose = app.mongoose;

  const GiftSchema = new mongoose.Schema({
    title: { type: String }, // 标题
    desc: { type: String }, // 描述
    cover: { type: mongoose.Schema.Types.ObjectId, ref: 'Attachment' }, // 礼物封面
    animation: { type: mongoose.Schema.Types.ObjectId, ref: 'Attachment' }, // 礼物动画
    price: { type: Number }, // 价格
    status: { // 状态 0-待上架 1-上架中 2-已下架
      type: Number,
      enum: [ 0, 1, 2 ],
      default: 0,
    },
    type: { // 类型 0-普通礼物 1-特效礼物;
      type: Number,
      enum: [ 0, 1 ],
      default: 0,
    },
  },
  // schema 的选项options
  {
    // id: true, // id: 默认true，Mongoose会默认生成一个虚拟值id,指向数据库的_id，但会转成字符串返回
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }, // 生成时间
  });

  return mongoose.model('Gift', GiftSchema);
};
