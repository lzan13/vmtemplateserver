/*!
 * ml-server - friend.js
 * Copyright(c) 2016 lzan13 <lzan13.gg@gmail.com>
 * MIT Licensed
 *
 * Created by lzan13 on 2016/12/19.
 * 用户关系操作相关接口
 */

// 事件代理
var EventProxy = require('eventproxy');
// 项目配置文件
var config = require('../../app.config');
// 好友关系代理
var Friend = require('../../proxy').Friend;
// 用户代理
var User = require('../../proxy').User;

/**
 * 构建响应体，并将响应结果返回给接口调用者，结果包含状态以及请求得到的数据
 * {
 *    "status": { // 响应状态
 *        "code": 0,
 *        "message": 'Success'
 *    },
 *    "data": {   // 响应的数据
 *        result:result
 *    }
 * }
 */
var result = {status: {code: config.code.no_error, msg: config.msg.success}, data: {}};

/**
 * 添加好友
 * @param req
 * @param res
 * @param next
 */
exports.addFriend = function (req, res, next) {
    var eventProxy = new EventProxy();
    // 错误回调处理接口
    eventProxy.fail(function (error) {
        // 响应状态
        result.status = error;
        res.send(result);
    });

    var username = req.user.username;
    var friend_username = req.params.username;
    Friend.getFriendByUsername(username, friend_username, function (error, friend) {
        if (friend) {
            // 好友关系已存在，重复的请求
            return eventProxy.throw({
                code: config.code.duplication_request,
                msg: config.msg.duplication_request
            });
        }
        User.getUserByUsername(friend_username, function (error, user) {
            if (!user) {
                // 用户不存在
                return eventProxy.throw({code: config.code.user_not_exist, msg: config.msg.user_not_exist});
            }
            Friend.addFriendByUsername(username, friend_username, function (error, friend) {
                if (error) {
                    // 数据库异常
                    return eventProxy.throw({code: config.code.db_exception, msg: config.msg.db_exception});
                }
                // 添加好友成功
                result.data.friend = friend;
                res.send(result);
            });
        });
    });
};

/**
 * 删除好友
 * @param req
 * @param res
 * @param next
 */
exports.removeFriend = function (req, res, next) {
    var username = req.user.username;
    var friend_username = req.params.username;
    // Friend.getFriendByUsername(username, friend_username, function (error, friend) {
    //     if (!friend) {
    //         // 好友关系不存在
    //         return eventProxy.throw({code: config.code.user_not_exist, msg: config.msg.user_not_exist});
    //     }
    Friend.removeFriendByUsername(username, friend_username, function (error) {
        if (error) {
            // 数据库异常
            return eventProxy.throw({code: config.code.db_exception, msg: config.msg.db_exception});
        }
        // 删除成功
        res.send(result);
    });
    // });
};

/**
 * 根据用户名列表获取用户列表
 * @param req 请求参数
 * @param res 响应数据
 * @param next
 */
exports.getFriends = function (req, res, next) {
    var eventProxy = new EventProxy();
    // 错误回调处理接口
    eventProxy.fail(function (error) {
        // 响应状态
        result.status = error;
        res.send(result);
    });

    // 获取请求提交的数据
    var username = req.user.username;
    Friend.getFriendsByUsername(username, function (error, friends) {
        if (error) {
            // 数据库异常
            return eventProxy.throw({code: config.code.db_exception, msg: config.msg.db_exception});
        }
        if (friends && friends.length > 0) {
            var friendArray = [];
            friends.forEach(function (friend, i) {
                friendArray[i] = friend.friend_username;
            });
            User.getUserByNames(friendArray, function (error, users) {
                if (error) {
                    // 数据库异常
                    return eventProxy.throw({code: config.code.db_exception, msg: config.msg.db_exception});
                }
                result.data.friends = users;
                res.send(result)
            });
        } else {
            // 查询数据为空
            return eventProxy.throw({code: config.code.data_is_empty, msg: config.msg.data_is_empty});
        }
    });
};
