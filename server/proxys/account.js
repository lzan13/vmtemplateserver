/**
 * Created by lzan13 on 2017/11/9.
 */

var mongoose = require('mongoose');
var Account = require('../models').Account;

// 进行查询时需要的列
var selected = '_id name email phone avatar cover gender address nickname description note_count create_at update_at activated deleted admin';

/**
 * 创建账户并保存
 */
exports.createAndSaveAccount = function (id, name, email, password, code, callback) {
    var account = new Account();
    if (id === '') {
        id = mongoose.Types.ObjectId();
    }
    account._id = id;
    account.name = name;
    account.email = email;
    account.password = password;
    account.code = code;
    account.save(callback);
};

/**
 * 根据账户Id获取账户信息
 */
exports.getAccountById = function (id, callback) {
    Account.findById(id, callback);
};

/**
 * 根据账户名获取账户信息
 */
exports.getAccountByName = function (name, callback) {
    Account.findOne({name: name}, callback);
};

/**
 * 根据邮箱查询账户
 */
exports.getAccountByEmail = function (email, callback) {
    Account.findOne({email: email}, callback);
};

/**
 * 根据 token 查找账户
 */
exports.getAccountByToken = function (token, callback) {
    Account.findOne({token: token}, callback);
};

/**
 * 认证账户
 */
exports.authAccount = function (query, callback) {
    Account.find(query, callback);
};

/**
 * 根据条件查询
 */
exports.getAccountByQuery = function (query, opt, callback) {
    Account.find(query, selected, opt, callback);
};

/**
 * 查询满足条件的数量
 */
exports.getAccountCount = function (query, callback) {
    Account.count(query, callback);
};