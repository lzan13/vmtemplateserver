/**
 * Created by lzan13 on 2017/11/9.
 * 用户数据模型
 */

var tools = require('../common/tools');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * 构建用户数据信息结构
 * 主要包含字段: 
 * _id
 * username
 * email
 * phone
 * password
 * avatar
 * cover
 * gender
 * nickname
 * signature
 * address
 * token
 * code
 * verified
 * deleted
 * admin
 * create_at
 * update_at
 * @type {mongoose.Schema}
 */
var AccountSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, index: true, unique: true, required: true },
    username: { type: String, index: true, unique: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String },
    password: { type: String },
    avatar: { type: String },
    cover: { type: String },
    // 性别，0 女，1 男，2 神秘
    gender: {
        type: Number,
        enum: [0, 1, 2],
        default: 2
    },
    nickname: { type: String },
    signature: { type: String },
    address: { type: String },
    // 账户 token，记录账户登录认证信息
    token: { type: String },
    code: { type: String },
    // 账户认证状态 刚注册为未认证
    verified: { type: Boolean, default: false },
    // 是否被删除
    deleted: { type: Boolean, default: false },
    // 管理员身份
    admin: { type: Boolean, default: false },
    create_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now }
}, { autoIndex: false });

// 设置方式好像无效
// AccountSchema.set('_id', false);
// AccountSchema.set('autoIndex', false);
// AccountSchema.index({name: 1}, {unique: true});
// AccountSchema.index({email: 1}, {unique: true, required: true});

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
