/**
 * Created by lzan13 on 2016/12/14.
 * 用户信息相关操作接口模块儿
 */

/**
 * 事件代理
 */
var EventProxy = require('eventproxy');
/**
 * 项目配置文件
 */
var config = require('../../app.config');

/**
 * 获取用户代理模块
 */
var User = require('../../proxy').User;

/**
 * 创建并保存账户
 * @param req 请求参数
 * @param res 响应数据
 */
exports.createUser = function (req, res, next) {
    /**
     * 构建响应体，并将响应结果返回给接口调用者，结果包含状态以及请求得到的数据
     * {
     *    "status": { // 响应状态
     *        "code": 10000,
     *        "message": 'Success'
     *    },
     *    "data": {   // 响应的数据
     *        token: token,
     *        deadline: deadline
     *    }
     * }
     */
    var response = {status: {}, data: {}};

    var eventProxy = new EventProxy();
    // 错误回调处理接口
    eventProxy.on('error', function (error) {
        // 响应状态
        response.status = error;
        res.send(response);
    });

    // 获取请求提交的数据
    var username = req.body.username;
    var password = req.body.password;

    // 校验数据，判断必须数据是否有空值
    var isEmpty = [username, password].some(function (item) {
        return item === '' || typeof(item) === config.msg.success;
    });
    if (isEmpty) {
        eventProxy.emit('error', {code: config.code.params_empty, msg: config.msg.params_empty});
        return;
    }
    // 注册前首先查询是否已经存在
    User.getUserByUsername(username, function (error, user) {
        if (error) {
            // 服务器数据库错误
            eventProxy.emit('error', {code: config.code.db_exception, msg: config.msg.db_exception + error.msg});
            return;
        }
        if (user) {
            // 用户已存在
            eventProxy.emit('error', {code: config.code.user_already_exist, msg: config.msg.user_already_exist});
            return;
        }
        // 创建并保存一个新用户
        User.createAndSaveUser(username, password, function (error, user) {
            if (error) {
                // 数据库异常
                eventProxy.emit('error', {code: config.code.db_exception, msg: config.msg.db_exception + error.msg});
                return;
            }
            if (user) {
                // 注册成功
                response.status.code = config.code.no_error;
                response.status.msg = config.msg.success;
                response.data.user = user;
                res.send(response);
            } else {
                // 注册失败
                eventProxy.emit('error', {code: config.code.sign_up_failed, msg: config.msg.sign_up_failed});
                return;
            }
        });
    });
};

/**
 * 更新用户信息
 * @param req 请求参数
 * @param res 响应数据
 * @param next
 */
exports.updateUser = function (req, res, next) {
    var response = {status: {}, data: {}};

    var eventProxy = new EventProxy();
    // 错误回调处理接口
    eventProxy.on('error', function (error) {
        // 响应状态
        response.status = error;
        res.send(response);
    });

    var email = req.body.email;
    var avatar = req.body.avatar;
    var cover = req.body.cover;
    var nickname = req.body.nickname;
    var signature = req.body.signature;
    var location = req.body.location;
    var gender = req.body.gender;
    var access_token = req.body.access_token;

    User.getUserByAccessToken(access_token, function (error, user) {
        if (error) {
            // 数据库异常
            eventProxy.emit('error', {code: config.code.db_exception, msg: config.msg.db_exception});
            return;
        }
        user.email = email;
        user.avatar = avatar;
        user.cover = cover;
        user.nickname = nickname;
        user.signature = signature;
        user.location = location;
        user.gender = gender;
        user.save(function (error, user) {
            if (error) {
                // 数据库异常
                eventProxy.emit('error', {code: config.code.db_exception, msg: config.msg.db_exception});
                return;
            }
            // 保存成功，将更新后的用户信息返回
            response.status.code = config.code.no_error;
            response.status.msg = config.msg.success;
            response.data.user = user;
            res.send(response);
        });
    });
};

/**
 * 更新用户头像
 * @param req 请求参数
 * @param res 响应数据
 * @param next
 */
exports.updateAvatar = function (req, res, next) {
    var response = {status: {}, data: {}};

    var eventProxy = new EventProxy();
    // 错误回调处理接口
    eventProxy.on('error', function (error) {
        // 响应状态
        response.status = error;
        res.send(response);
    });

    // 获取请求提交的数据
    var avatar = req.body.avatar;
    var access_token = req.body.access_token;
    User.getUserByAccessToken(access_token, function (error, user) {
        if (error) {
            // 数据库异常
            eventProxy.emit('error', {code: config.code.db_exception, msg: config.msg.db_exception + error.msg});
            return;
        }
        user.avatar = avatar;
        user.save(function (error, user) {
            response.status.code = config.code.no_error;
            response.status.msg = config.msg.success;
            response.data.user = user;
            res.send(response);
        });
    });
};

/**
 * 更新用户背景图
 * @param req 请求参数
 * @param res 响应数据
 * @param next
 */
exports.updateCover = function (req, res, next) {
    var response = {status: {}, data: {}};

    var eventProxy = new EventProxy();
    // 错误回调处理接口
    eventProxy.on('error', function (error) {
        // 响应状态
        response.status = error;
        res.send(response);
    });

    // 获取请求提交的数据
    var cover = req.body.cover;
    var access_token = req.body.access_token;
    User.getUserByAccessToken(access_token, function (error, user) {
        if (error) {
            // 数据库异常
            eventProxy.emit('error', {code: config.code.db_exception, msg: config.msg.db_exception + error.msg});
            return;
        }
        user.cover = cover;
        user.save(function (error, user) {
            response.status.code = config.code.no_error;
            response.status.msg = config.msg.success;
            response.data.user = user;
            res.send(response);
        });
    });
};

/**
 * 获取用户信息
 * @param req 请求参数
 * @param res 响应数据
 * @param next
 */
exports.getUserInfo = function (req, res, next) {
    var response = {status: {}, data: {}};

    var eventProxy = new EventProxy();
    // 错误回调处理接口
    eventProxy.on('error', function (error) {
        // 响应状态
        response.status = error;
        res.send(response);
    });

    // 获取请求提交的数据
    var username = req.params.username;
    User.getUserByUsername(username, function (error, user) {
        if (error) {
            // 数据库异常
            eventProxy.emit('error', {code: config.code.db_exception, msg: config.msg.db_exception + error.msg});
            return;
        }
        if (user) {
            response.status.code = config.code.no_error;
            response.status.msg = config.msg.success;
            response.data.user = user;
            res.send(response);
        } else {
            // 用户不存在
            eventProxy.emit('error', {code: config.code.user_not_exist, msg: config.msg.user_not_exist});
            return;
        }
    });
};

/**
 * 添加好友
 * @param req
 * @param res
 * @param next
 */
exports.addFriend = function (req, res, next) {

};

/**
 * 删除好友
 * @param req
 * @param res
 * @param next
 */
exports.removeFirend = function (req, res, next) {

};

/**
 * 根据用户名列表获取用户列表
 * @param req 请求参数
 * @param res 响应数据
 * @param next
 */
exports.getFriendsInfo = function (req, res, next) {
    var response = {status: {}, data: {}};

    var eventProxy = new EventProxy();
    // 错误回调处理接口
    eventProxy.on('error', function (error) {
        // 响应状态
        response.status = error;
        res.send(response);
    });

    // 获取请求提交的数据
    var username = req.params.username;
    var friends = req.params.friends;
    var firendArray = friends.split(',');
    User.getUserByNames(firendArray, function (error, users) {
        if (error) {
            // 数据库异常
            eventProxy.emit('error', {code: config.code.db_exception, msg: config.msg.db_exception + error.msg});
            return;
        }
        if (users && users.length > 0) {
            response.status.code = config.code.no_error;
            response.status.msg = config.msg.success;
            response.data.users = users;
            res.send(response);
        } else {
            // 用户不存在
            eventProxy.emit('error', {code: config.code.user_not_exist, msg: config.msg.user_not_exist});
            return;
        }
    });
};

