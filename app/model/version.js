/**
 * Create by lzan13 2021/7/2
 * 描述：版本数据模型，这里保存版本配置相关数据
 */
'use strict';
module.exports = app => {
  const mongoose = app.mongoose;

  const VersionSchema = new mongoose.Schema({
    // 平台
    platform: { type: String, required: true },
    // 标题
    title: { type: String },
    // 升级描述
    desc: { type: String },
    // 升级地址
    url: { type: String },
    // 版本号
    versionCode: { type: Number },
    // 版本名称
    versionName: { type: String },
    // 强制升级
    force: { type: Boolean, default: false },
  },
  // schema 的选项options
  {
    // id: 默认true，Mongoose会默认生成一个虚拟值id,指向数据库的_id，但会转成字符串返回
    id: true,
    // 生成时间
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  });

  return mongoose.model('Version', VersionSchema);
};
