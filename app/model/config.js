/**
 * Create by lzan13 2020/7/7
 * 描述：配置数据模型，这里保存配置相关数据，通过包括但不限于站点配置，客户端所需配置等
 */
'use strict';
module.exports = app => {
  const mongoose = app.mongoose;

  const ConfigSchema = new mongoose.Schema({
    alias: { type: String, required: true, default: 'default' }, // 配置别名
    title: { type: String, required: true }, // 标题
    desc: { type: String }, // 描述
    content: { type: String }, // 配置内容，这里偷懒了，内容可以传 json 传，可以扩展
    createdAt: { type: Number },
    updatedAt: { type: Number },
  },
  // schema 的选项options
  {
    // id: true, // id: 默认true，Mongoose会默认生成一个虚拟值id,指向数据库的_id，但会转成字符串返回
    timestamps: { currentTime: () => Date.now(), createdAt: true, updatedAt: true }, // 时间戳配置
  });

  return mongoose.model('Config', ConfigSchema);
};
