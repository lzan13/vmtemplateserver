/**
 * Create by lzan13 2020/7/7
 * 描述：角色数据模型
 */
'use strict';
module.exports = app => {
  const mongoose = app.mongoose;

  const RoleSchema = new mongoose.Schema({
    title: { type: String, unique: true, required: true }, // 角色名
    desc: { type: String }, // 角色描述
    identity: { // 角色身份，1000-超管 900-管理员 800-运营者 700-检查员 600-监管员 100-VIP账户 9-普通账户 8-上线审核 7-待激活账户 2-锁定账户 1-黑名单账户
      type: Number,
      enum: [ 1000, 900, 800, 700, 600, 100, 9, 8, 7, 2, 1 ],
      default: 9,
    },
    createdAt: { type: Number },
    updatedAt: { type: Number },
  },
  // schema 的选项options
  {
    // id: true, // id: 默认true，Mongoose会默认生成一个虚拟值id,指向数据库的_id，但会转成字符串返回
    timestamps: { currentTime: () => Date.now(), createdAt: true, updatedAt: true }, // 时间戳配置
  });

  return mongoose.model('Role', RoleSchema);
};
