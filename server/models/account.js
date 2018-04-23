/**
 * Created by lzan13 on 2017/11/9.
 * 用户数据模型
 */

var tools = require('../common/tools');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * 构建用户数据信息结构
 * 主要包含字段: name, email, phone, password, avatar, cover, gender, address, nickname, description, note_count, create_at, update_at, token, activated, deleted, admin
 * @type {mongoose.Schema}
 */
var AccountSchema = new Schema({
    name: {type: String},
    email: {type: String},
    phone: {type: String},
    password: {type: String},
    avatar: {type: String},
    cover: {type: String},
    // 性别，0 女，1 男，2 中性
    gender: {
        type: Number,
        enum: [0, 1, 2],
        default: 2
    },
    address: {type: String},
    nickname: {type: String},
    description: {type: String},
    note_count: {type: Number, default: 0},
    create_at: {type: Date, default: Date.now},
    update_at: {type: Date, default: Date.now},
    // token，用于认证登录，新注册账户这里会保存激活字符串，用来邮箱激活
    token: {type: String},
    code: {type: String},
    // 账户激活状态 刚注册为未激活
    activated: {type: Boolean, default: false},
    // 是否被删除
    deleted: {type: Boolean, default: false},
    // 管理员身份
    admin: {type: Boolean, default: false}
});

// 设置索引
AccountSchema.set('autoIndex', false);
AccountSchema.index({name: 1}, {unique: true});
AccountSchema.index({email: 1}, {unique: true, required: true});

// 每次调用 save 方法，都检查密码是否修改，然后将密码加密处理，同时数据的 update_at 值为当前时间
AccountSchema.pre('save', function (next) {
    var now = new Date();
    this.update_at = now;
    if (this.isModified('password') || this.isNew) {
        var hash = tools.cryptoSHA1(this.password);
        this.password = hash;
        next();
    } else {
        return next();
    }
});

mongoose.model('account', AccountSchema);
