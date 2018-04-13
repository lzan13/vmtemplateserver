/**
 * Created by lzan13 on 2017/11/11.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * 构建笔记数据信息结构
 * 主要包含字段: authorId, content, tags, top, deleted, cretae_at, update_at
 * @type {mongoose.Schema}
 */
var NoteSchema = new Schema({
    authorId: {type: String},
    content: {type: String},
    tags: {type: Array},
    top: {type: Boolean, default: false},
    deleted: {type: Boolean, default: false},
    create_at: {type: Date, default: Date.now},
    update_at: {type: Date, default: Date.now}
});

// 设置不自动索引
// NoteSchema.set(autoIndex, false);

// 每次调用 save 方法，更新数据的 update_at 值为当前时间
NoteSchema.pre('save', function (next) {
    var now = new Date();
    this.update_at = now;
    next();
});

mongoose.model('note', NoteSchema);