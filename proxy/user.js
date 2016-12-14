/**
 * Created by lzan13 on 2016/9/23.
 * 账户操作代理类，主要进行账户相关的操作，比如注册，登录，查询，修改等
 */
var User = require('../models').User;

/**
 * 根据用户名查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param username 用户名
 * @param callback 回调函数
 */
exports.getUserByUsername = function (username, callback) {
    User.findOne({username: username}, callback);
};

/**
 * 根据邮箱查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} email 邮箱地址
 * @param {Function} callback 回调函数
 */
exports.getUserByMail = function (email, callback) {
    User.findOne({email: email}, callback);
};

/**
 * 根据用户名列表查找用户列表
 * Callback:
 * - err, 数据库异常
 * - users, 用户列表
 * @param {Array} names 用户名列表
 * @param {Function} callback 回调函数
 */
exports.getUserByNames = function (names, callback) {
    User.find({username: {$in: names}}, callback);
}

/**
 * 根据关键字，获取一组用户
 * Callback:
 * - err, 数据库异常
 * - users, 用户列表
 * @param {String} query 查询关键字
 * @param {Object} opt 查询选项
 * @param {Function} callback 回调函数
 */
exports.getUsersByQuery = function (query, opt, callback) {
    User.find(query, '', opt, callback);
};

/**
 * 根据用户名和密码获取账户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} username 用户名
 * @param {String} password 用户密码
 * @param {Function} callback 回调函数
 */
exports.getUserByUsernameAndKey = function (username, password, callback) {

};

/**
 * 保存账户
 * Callback
 * - err, 数据库异常
 * - user, 用户
 * @param {String} username 用户名
 * @param {String} password 用户密码
 * @param {Function} callback 回调函数
 */
exports.createAndSaveUser = function (username, password, callback) {
    var user = new User();
    user.username = username;
    user.password = password;
    user.save(callback);
};