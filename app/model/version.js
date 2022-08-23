/**
 * Create by lzan13 2021/7/2
 * 描述：版本数据模型，这里保存版本配置相关数据
 */
'use strict';
module.exports = app => {
  const mongoose = app.mongoose;

  const VersionSchema = new mongoose.Schema({
    platform: { // 平台 0-Android 1-iOS 2-Mac 3-PC
      type: Number,
      enum: [ 0, 1, 2, 3 ],
      default: 0,
    },
    title: { type: String }, // 标题
    desc: { type: String }, // 描述
    url: { type: String }, // 地址
    negativeBtn: { type: String, default: '暂不升级' }, // 消极按钮
    positiveBtn: { type: String, default: '马上升级' }, // 积极按钮
    versionCode: { type: Number }, // 版本号
    versionName: { type: String }, // 版本名称
    force: { type: Boolean, default: false }, // 强制升级
    createdAt: { type: Number },
    updatedAt: { type: Number },
  },
  // schema 的选项options
  {
    // id: true, // id: 默认true，Mongoose会默认生成一个虚拟值id,指向数据库的_id，但会转成字符串返回
    timestamps: { currentTime: () => Date.now(), createdAt: true, updatedAt: true }, // 时间戳配置
  });

  return mongoose.model('Version', VersionSchema);
};
