/**
 * Create by lzan13 2020/7/7
 * 描述：角色数据模型
 */
'use strict';
module.exports = app => {
  const mongoose = app.mongoose;

  const RoleSchema = new mongoose.Schema({
    // 角色名
    title: { type: String, unique: true, required: true },
    // 角色描述
    desc: { type: String },
    // 角色身份，999-超管，888-管理员，777-运营账户，9-普通账户，8-待激活账户，2-锁定账户，1-永久删除
    identity: {
      type: Number,
      enum: [ 999, 888, 777, 9, 8, 2, 1, 0 ],
      default: 9,
    },
  },
  // schema 的选项options
  {
    // id: 默认true，Mongoose会默认生成一个虚拟值id,指向数据库的_id，但会转成字符串返回
    id: true,
    // 生成时间
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  });

  return mongoose.model('Role', RoleSchema);
};
