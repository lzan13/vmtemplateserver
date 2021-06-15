/**
 * Create by lzan13 2020/7/7
 * 描述：打卡记录数据模型
 */
'use strict';
module.exports = app => {
  const mongoose = app.mongoose;

  const ClockSchema = new mongoose.Schema({
    // 用户 Id
    userId: { type: String, required: true, index: true },
  },
  // schema 的选项options
  {
    // id: 默认true，Mongoose会默认生成一个虚拟值id,指向数据库的_id，但会转成字符串返回
    id: true,
    // 生成时间，记录打卡时间
    timestamps: { createdAt: 'createdAt' },
  });

  return mongoose.model('Clock', ClockSchema);
};
