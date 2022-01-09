/**
 * Create by lzan13 2020/7/7
 * 描述：打卡记录数据模型
 */
'use strict';
module.exports = app => {
  const mongoose = app.mongoose;

  const ClockSchema = new mongoose.Schema({
    userId: { type: String, required: true, index: true }, // 用户 Id
  },
  // schema 的选项options
  {
    // id: true, // id: 默认true，Mongoose会默认生成一个虚拟值id,指向数据库的_id，但会转成字符串返回
    timestamps: { createdAt: 'createdAt' }, // 生成时间，记录打卡时间
  });

  return mongoose.model('Clock', ClockSchema);
};
