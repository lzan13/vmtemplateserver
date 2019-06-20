/**
 * Created by lzan13 on 2018/4/25.
 */

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

/**
 * 构建笔记 Category 数据结构
 * 主要包含字段: _id, author_id, title, create_at, update_at
 * @type {mongoose.Schema}
 */
let MatchSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, index: true, unique: true, required: true },
    account_id: { type: Schema.Types.ObjectId, index: true, required: true },
    create_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now }
}, { autoIndex: false });

// 下边的 set 方式设置好像无效，
// NoteSchema.set('_id', false);
// NoteSchema.set('autoIndex', false);
// NoteSchema.index({_id: -1}, {unique: true});

// 每次调用 save 方法，更新数据的 update_at 值为当前时间
MatchSchema.pre('save', function (next) {
    let now = new Date();
    this.update_at = now;
    next();
});

mongoose.model('match', MatchSchema);