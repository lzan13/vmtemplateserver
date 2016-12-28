/**
 * Created by lzan13 on 2016/12/14.
 * 用户信息相关操作接口模块儿
 */

    // 事件代理
var EventProxy = require('eventproxy');
// 项目配置文件
var config = require('../../app.config');
// 获取用户代理模块
var User = require('../../proxy').User;
var easemob = require('./easemob/em_rest');

/**
 * 构建响应体，并将响应结果返回给接口调用者，结果包含状态以及请求得到的数据
 * {
 *    "status": { // 响应状态
 *        "code": 0,
 *        "msg": 'Success'
 *    },
 *    "data": {   // 响应的数据
 *        result:result
 *    }
 * }
 */
var result = {status: {code: config.code.no_error, msg: config.msg.success}, data: {}};

/**
 * 创建并保存账户
 * @param req 请求参数
 * @param res 响应数据
 */
exports.createUser = function (req, res, next) {
    // 回调代理
    var ep = new EventProxy();
    // 获取请求提交的数据
    var username = req.body.username;
    var password = req.body.password;
    // 校验数据，判断必须数据是否有空值
    var isEmpty = [username, password].some(function (item) {
        return item === '' || typeof(item) === config.msg.success;
    });
    if (isEmpty) {
        return ep.throw({code: config.code.params_empty, msg: config.msg.params_empty});
    }
    // 调用环信 rest 接口先注册环信账户，成功之后再注册本地账户
    easemob.createUser(username, password, function (data) {
        if (data.status.code !== config.code.no_error) {
            return res.send(data);
        }
        // 注册前首先查询是否已经存在
        User.getUserByUsername(username, function (error, user) {
            if (error) {
                // 服务器数据库错误
                ep.throw({code: config.code.db_exception, msg: config.msg.db_exception + error.msg});
                return;
            }
            if (user) {
                // 用户已存在
                ep.throw({code: config.code.user_already_exist, msg: config.msg.user_already_exist});
                return;
            }
            // 创建并保存一个新用户
            User.createAndSaveUser(username, password, function (error, user) {
                if (error) {
                    // 数据库异常
                    ep.throw({code: config.code.db_exception, msg: config.msg.db_exception + error.msg});
                    return;
                }
                if (user) {
                    // 注册成功
                    result.data.user = user;
                    res.send(result);
                } else {
                    // 注册失败
                    ep.throw({code: config.code.sign_up_failed, msg: config.msg.sign_up_failed});
                    return;
                }
            });
        });
    });

    // 错误回调处理接口
    ep.fail(function (error) {
        // 响应状态
        result.status = error;
        res.send(result);
    });
};

/**
 * 更新用户信息
 * @param req 请求参数
 * @param res 响应数据
 * @param next
 */
exports.updateUser = function (req, res, next) {
    // 回调代理
    var ep = new EventProxy();

    var email = req.body.email;
    var nickname = req.body.nickname;
    var signature = req.body.signature;
    var location = req.body.location;
    var gender = req.body.gender;
    var access_token = req.body.access_token;

    User.getUserByAccessToken(access_token, function (error, user) {
        if (error) {
            // 数据库异常
            ep.throw({code: config.code.db_exception, msg: config.msg.db_exception});
            return;
        }
        user.email = email;
        user.nickname = nickname;
        user.signature = signature;
        user.location = location;
        user.gender = gender;
        user.save(function (error, user) {
            if (error) {
                // 数据库异常
                ep.throw({code: config.code.db_exception, msg: config.msg.db_exception});
                return;
            }
            // 保存成功，将更新后的用户信息返回
            result.data.user = user;
            res.send(result);
        });
    });

    // 错误回调处理接口
    ep.fail(function (error) {
        // 响应状态
        result.status = error;
        res.send(result);
    });
};

/**
 * 更新用户头像
 * @param req 请求参数
 * @param res 响应数据
 * @param next
 */
exports.updateAvatar = function (req, res, next) {
    // 回调代理
    var ep = new EventProxy();
    // 获取请求提交的数据
    var avatar = req.body.avatar;
    var access_token = req.body.access_token;
    User.getUserByAccessToken(access_token, function (error, user) {
        if (error) {
            // 数据库异常
            ep.throw({code: config.code.db_exception, msg: config.msg.db_exception + error.msg});
            return;
        }
        user.avatar = avatar;
        user.save(function (error, user) {
            result.data.user = user;
            res.send(result);
        });
    });

    // 错误回调处理接口
    ep.fail(function (error) {
        // 响应状态
        result.status = error;
        res.send(result);
    });
};

/**
 * 更新用户背景图
 * @param req 请求参数
 * @param res 响应数据
 * @param next
 */
exports.updateCover = function (req, res, next) {
    // 回调代理
    var ep = new EventProxy();
    // 获取请求提交的数据
    var cover = req.body.cover;
    var access_token = req.body.access_token;
    User.getUserByAccessToken(access_token, function (error, user) {
        if (error) {
            // 数据库异常
            ep.throw({code: config.code.db_exception, msg: config.msg.db_exception + error.msg});
            return;
        }
        user.cover = cover;
        user.save(function (error, user) {
            result.data.user = user;
            res.send(result);
        });
    });

    // 错误回调处理接口
    ep.fail(function (error) {
        // 响应状态
        result.status = error;
        res.send(result);
    });
};

/**
 * 获取用户信息
 * @param req 请求参数
 * @param res 响应数据
 * @param next
 */
exports.getUserInfo = function (req, res, next) {
    // 回调代理
    var ep = new EventProxy();
    // 获取请求提交的数据
    var username = req.params.username;
    User.getUserByUsername(username, function (error, user) {
        if (error) {
            // 数据库异常
            return ep.throw({code: config.code.db_exception, msg: config.msg.db_exception + error.msg});
        }
        if (user) {
            result.data.user = user;
            res.send(result);
        } else {
            // 用户不存在
            return ep.throw({code: config.code.user_not_exist, msg: config.msg.user_not_exist});
        }
    });

    // 错误回调处理接口
    ep.fail(function (error) {
        // 响应状态
        result.status = error;
        res.send(result);
    });

};

/**
 * 根据用户名列表获取用户列表
 * @param req 请求参数
 * @param res 响应数据
 * @param next
 */
exports.getFriends = function (req, res, next) {
    // 回调代理
    var ep = new EventProxy();
    // 获取请求提交的数据
    var names = req.params.names;
    var friends = names.split(',');
    User.getUserByNames(friends, function (error, users) {
        if (error) {
            // 数据库异常
            ep.throw({code: config.code.db_exception, msg: config.msg.db_exception + error.msg});
            return;
        }
        if (users && users.length > 0) {
            result.data.users = users;
            res.send(result);
        } else {
            // 数据为空
            ep.throw({code: config.code.data_is_empty, msg: config.msg.data_is_empty});
            return;
        }
    });

    // 错误回调处理接口
    ep.fail(function (error) {
        // 响应状态
        result.status = error;
        res.send(result);
    });
};
