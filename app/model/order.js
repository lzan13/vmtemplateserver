/**
 * Create by lzan13 2021/8/9
 * 描述：订单数据模型
 */
'use strict';
module.exports = app => {
  const mongoose = app.mongoose;

  const OrderSchema = new mongoose.Schema({
    owner: { type: String }, // 订单所属用户
    orderId: { type: String }, // 订单 Id
    title: { type: String }, // 订单标题
    price: { type: String }, // 订单价格
    realPrice: { type: String }, // 实际支付价格
    commoditys: [{ // 商品信息
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Commodity',
    }],
    status: { // 订单状态 0-待支付 1-支付成功 2-已关闭
      type: Number,
      enum: [ 0, 1, 2 ],
      default: 0,
    },
    payType: { // 支付类型 0-微信 1-支付宝，可以设置默认支付方式
      type: Number,
      enum: [ 0, 1 ],
      default: 1,
    },
    remarks: { type: String }, // 订单备注
    extend: { type: String }, // 其他扩展
  },
  // schema 的选项options
  {
    // id: true, // id: 默认true，Mongoose会默认生成一个虚拟值id,指向数据库的_id，但会转成字符串返回
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }, // 生成时间
  });

  return mongoose.model('Order', OrderSchema);
};
