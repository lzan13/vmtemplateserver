/**
 * Created by lzan13 on 2017/11/9.
 */

let mongoose = require('mongoose');
let Account = require('../models').Account;

// 进行查询时需要的列，这里只是包含可对外暴露信息
let expr = '_id username email phone avatar cover gender nickname signature address create_at update_at'

/**
 * 创建账户并保存
 */
exports.createAndSaveAccount = function (email, password, code, callback) {
    let account = new Account();
    account._id = mongoose.Types.ObjectId();
    account.username = email;
    account.email = email;
    account.password = password;
    account.code = code;
    account.save(callback);
};

/**
 * 根据账户Id获取账户信息
 */
exports.getAccountById = function (id, callback) {
    Account.findById(id, expr, callback);
};

/**
 * 根据账户名获取账户信息
 */
exports.getAccountByName = function (name, callback) {
    Account.findOne({ name: name }, callback);
};

/**
 * 根据邮箱查询账户
 */
exports.getAccountByEmail = function (email, callback) {
    Account.findOne({ email: email }, callback);
};

/**
 * 根据 token 查找账户
 */
exports.getAccountByToken = function (token, callback) {
    Account.findOne({ token: token }, callback);
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
    Account.find(query, expr, opt, callback);
};

/**
 * 查询满足条件的数量
 */
exports.getAccountCount = function (query, callback) {
    Account.count(query, callback);
};