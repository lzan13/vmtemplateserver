/**
 * Created by lzan13 on 2016/9/22.
 * 用户数据模型
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: {
        type: String,
        trim: true,
        unique: true,
        required: true,
        index: true
    },
    password: {type: String, required: true},
    email: {type: String},
    avatar: {type: String},
    cover: {type: String},
    nickname: {type: String},
    signature: {type: String},
    location: {type: String},
    url: {type: String},
    gender: {
        type: String,
        enum: ['male', 'female', 'unknown'],
        default: 'unknown'
    },
    create_at: {type: Date, default: Date.now},
    update_at: {type: Date, default: Date.now},

    disable: {type: Boolean, default: false},
    is_block: {type: Boolean, default: false},
    accessToken: {type: String}
});

// 设置不自动索引
UserSchema.set('autoIndex', false);

// 每次调用 save 方法，都更新数据的 update_at 值为当前时间
UserSchema.pre('save', function (next) {
    var now = new Date();
    this.update_at = now;
    next();
});

mongoose.model('User', UserSchema);