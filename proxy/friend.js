/**
 * Created by lzan13 on 2016/12/18.
 * 账户好友管理代理操作模块儿，主要进行好友的添加和删除与查询等操作
 */

var Friend = require('../models').Friend;

/**
 * 添加一个好友
 * Callback
 * - error，数据库异常
 * - friend，好友
 * @param {String} username 用户名
 * @param {String} friend_username 好友的用户名
 * @param {Function} callback 回调函数
 */
exports.addFriendByUsername = function (username, friend_username, callback) {
    var friend = new Friend();
    friend.username = username;
    friend.friend_username = friend_username;
    friend.save(callback);
};

/**
 * 删除一个好友
 * Callback
 * - error，数据库异常
 * - friend，好友
 * @param {String} username 用户名
 * @param {String} friend_username 好友的用户名
 * @param {Function} callback 回调函数
 */
exports.removeFriendByUsername = function (username, friend_username, callback) {
    Friend.remove({username: username, friend_username: friend_username}, callback);
};

/**
 * 获取指定好友
 * Callback
 * - error, 数据库错误
 * - friend, 好友
 * @param {String} username 当前账户 username
 * @param {String} friend_username 好友 username
 * @param {Function} callback 回调函数
 */
exports.getFriendByUsername = function (username, friend_username, callback) {
    Friend.findOne({username: username, friend_username: friend_username}, callback);
};

/**
 * 获取好友列表
 * Callback
 * - error，数据库异常
 * - friends, 好友列表
 * @param {String} username 用户名
 * @param {Function} callback 回调函数
 */
exports.getFriendsByUsername = function (username, callback) {
    Friend.find({username: username}, callback);
};

/**
 * 6050 1410 9200 2968 71
 */