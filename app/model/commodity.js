/**
 * Create by lzan13 2021/11/18
 * 描述：商品数据模型
 */
'use strict';
module.exports = app => {
  const mongoose = app.mongoose;

  const CommoditySchema = new mongoose.Schema({
    title: { type: String }, // 商品标题
    desc: { type: String }, // 商品描述
    price: { type: String }, // 商品价格
    currPrice: { type: String }, // 优惠价格
    attachments: [{ // 附件信息
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Attachment',
    }],
    status: { // 商品状态 0-待上架 1-上架中 2-已下架 3-已售罄
      type: Number,
      enum: [ 0, 1, 2, 3 ],
      default: 0,
    },
    inventory: { type: Number, default: 999999 }, // 库存数量
    type: { // 商品类型 0-金币充值 1-开通/续费会员 2-普通商品
      type: Number,
      enum: [ 0, 1, 2 ],
      default: 0,
    },
    level: { // 开通/续费会员级别，1-月度 3-季度 12-年度 商品 type == 1 需要
      type: Number,
      enum: [ 1, 3, 12 ],
      default: 1,
    },
    remarks: { type: String }, // 商品备注
  },
  // schema 的选项options
  {
    // id: true, // id: 默认true，Mongoose会默认生成一个虚拟值id,指向数据库的_id，但会转成字符串返回
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }, // 生成时间
  });

  return mongoose.model('Commodity', CommoditySchema);
};
