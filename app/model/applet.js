/**
 * Create by lzan13 2020/7/7
 * 描述：小应用数据模型
 */
'use strict';
module.exports = app => {
  const mongoose = app.mongoose;

  const AppletSchema = new mongoose.Schema({
    title: { type: String, unique: true, required: true }, // 标题
    content: { type: String }, // 描述
    tips: { type: String }, // 提示
    isNeedVIP: { type: Boolean, default: false }, // 需要 vip 资格
    type: { // 类型 0-H5 1-小应用 2-小游戏
      type: Number,
      enum: [ 0, 1, 2 ],
      default: 0,
    },
    appId: { type: String }, // 程序 Id
    cover: { type: mongoose.Schema.Types.ObjectId, ref: 'Attachment' }, // 封面
    body: { type: mongoose.Schema.Types.ObjectId, ref: 'Attachment' }, // 数据包
    url: { type: String }, // 地址
    versionCode: { type: Number, default: 0 }, // 版本号
    versionName: { type: String, default: '0.0.1' }, // 版本名称
  },
  // schema 的选项options
  {
    // id: true, // id: 默认true，Mongoose会默认生成一个虚拟值id,指向数据库的_id，但会转成字符串返回
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }, // 生成时间
  });

  return mongoose.model('Applet', AppletSchema);
};
