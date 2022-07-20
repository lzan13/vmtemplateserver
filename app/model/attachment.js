/**
 * Create by lzan13 2020/7/7
 * 描述：附件数据模型
 */
'use strict';
module.exports = app => {
  const mongoose = app.mongoose;

  const AttachmentSchema = new mongoose.Schema({
    owner: { type: String, required: true }, // 上传者
    desc: { type: String }, // 文件描述
    duration: { type: Number }, // 时长 附件为声音、视频时有值
    extname: { type: String }, // 扩展名
    path: { type: String }, // 文件路径，这里一般保存相对路径，展示时拼接域名
    width: { type: Number }, // 宽度，高度 附件为图片、视频时有值
    height: { type: Number },
    space: { type: String }, // 存储空间目录
  },
  // schema 的选项options
  {
    // id: true, // id: 默认true，Mongoose会默认生成一个虚拟值id,指向数据库的_id，但会转成字符串返回
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }, // 生成时间
  });

  return mongoose.model('Attachment', AttachmentSchema);

};
