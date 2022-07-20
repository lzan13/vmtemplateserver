/**
 * Create by lzan13 2021/8/9
 * 描述：积分变动数据模型
 */
'use strict';
module.exports = app => {
  const mongoose = app.mongoose;

  const ScoreSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // 所属用户
    title: { type: String }, // 交易标题
    count: { type: Number }, // 变动数量
    remarks: { type: String }, // 备注
    type: { // 交易类型 0-系统赠送 1-充值 2-消费
      type: Number,
      enum: [ 0, 1, 2 ],
      default: 0,
    },
  },
  // schema 的选项options
  {
    // id: true, // id: 默认true，Mongoose会默认生成一个虚拟值id,指向数据库的_id，但会转成字符串返回
    timestamps: { createdAt: 'createdAt' }, // 生成时间
  });

  return mongoose.model('Score', ScoreSchema);
};
