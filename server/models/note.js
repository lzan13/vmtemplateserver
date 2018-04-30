/**
 * Created by lzan13 on 2017/11/11.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * 构建笔记数据信息结构
 * 主要包含字段: id, author_id, content, tags, pinup, blog, deleted, create_at, update_at
 * @type {mongoose.Schema}
 */
var NoteSchema = new Schema({
    _id: {type: Schema.Types.ObjectId, index: true, unique: true, required: true},
    author_id: {type: Schema.Types.ObjectId, index: true, required: true},
    category_id: {type: Schema.Types.ObjectId, index: true},
    content: {type: String},
    tags: {type: Array},
    pinup: {type: Boolean, default: false},
    blog: {type: Boolean, default: false},
    deleted: {type: Boolean, default: false},
    create_at: {type: Date, default: Date.now},
    update_at: {type: Date, default: Date.now}
}, {autoIndex: false});

// 下边的 set 方式设置好像无效，
// NoteSchema.set('_id', false);
// NoteSchema.set('autoIndex', false);
// NoteSchema.index({_id: -1}, {unique: true});

// 每次调用 save 方法，更新数据的 update_at 值为当前时间
NoteSchema.pre('save', function (next) {
    var now = new Date();
    this.update_at = now;
    next();
});

mongoose.model('note', NoteSchema);