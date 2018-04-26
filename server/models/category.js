/**
 * Created by lzan13 on 2018/4/25.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * 构建笔记 Category 数据结构
 * 主要包含字段: _id, author_id, title, create_at, update_at
 * @type {mongoose.Schema}
 */
var CategorySchema = new Schema({
    _id: {type: Schema.Types.ObjectId, index: true, unique: true, required: true},
    author_id: {type: String, index: true, required: true},
    title: {type: String, required: true},
    create_at: {type: Date, default: Date.now},
    update_at: {type: Date, default: Date.now}
}, {autoIndex: false});

// 下边的 set 方式设置好像无效，
// NoteSchema.set('_id', false);
// NoteSchema.set('autoIndex', false);
// NoteSchema.index({_id: -1}, {unique: true});

// 每次调用 save 方法，更新数据的 update_at 值为当前时间
CategorySchema.pre('save', function (next) {
    var now = new Date();
    this.update_at = now;
    next();
});

mongoose.model('category', CategorySchema);