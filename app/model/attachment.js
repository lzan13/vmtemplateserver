/**
 * Create by lzan13 2020/7/7
 * 描述：附件数据模型
 */
'use strict';
module.exports = app => {
  const mongoose = app.mongoose;

  const AttachmentSchema = new mongoose.Schema({
    // 上传者
    owner: { type: String, required: true },
    // 扩展名
    extname: { type: String },
    // 文件名
    filename: { type: String },
    // 文件存放路径
    path: { type: String },
    // 扩展信息
    extra: { type: String },
  },
  // schema 的选项options
  {
    // id: 默认true，Mongoose会默认生成一个虚拟值id,指向数据库的_id，但会转成字符串返回
    id: true,
    // 生成时间
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  });

  return mongoose.model('Attachment', AttachmentSchema);

};
