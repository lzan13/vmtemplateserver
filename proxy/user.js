/**
 * Created by lzan13 on 2016/9/23.
 * 账户操作代理类，主要进行账户相关的操作，比如注册，登录，查询，修改等
 */
var User = require('../models').User;

/**
 * 根据用户名查找用户
 * @param username 用户名
 * @param callback 回调函数
 */
exports.getUserByUsername = function (username, callback) {
    User.findOne({username: username}, callback);
};

/**
 * 根据邮箱查找用户
 * @param email 邮箱地址
 * @param callback 回调函数
 */
exports.getUserByMail = function (email, callback) {
    User.findOne({email: email}, callback);
};
/**
 * 根据查询条件查询符合的数据
 * @param query 查询条件
 * @param opt 选项
 * @param callback 回到函数
 */
exports.getUsersByQuery = function (query, opt, callback) {
    User.find(query, '', opt, callback);
};

exports.getUserByUsernameAndKey = function (username, key, callback) {

};

/**
 * 保存账户
 * @param username 账户名
 * @param password 账户密码
 * @param callback 回调函数
 */
exports.saveUser = function (username, password, callback) {
    var user = new User();
    user.username = username;
    user.password = password;
    user.save(callback);

};