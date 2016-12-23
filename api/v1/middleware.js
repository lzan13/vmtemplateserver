/*
 Created by lzan13 on 2016/12/16.
 API 中间件，主要做一些验证操作
 */
// 事件代理
var EventProxy = require('eventproxy');
// 项目配置文件
var config = require('../../app.config');
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
 * 首先对请求进行验证，检查是否有权限进行操作
 * @param req 请求参数
 * @param res 响应数据
 * @param next
 */
exports.auth = function (req, res, next) {
    // 回调代理
    var eventProxy = new EventProxy();
    eventProxy.fail(function (error) {
        result.status = error;
        res.send(result);
    });

    // 获取请求参数中的 access token
    var access_token = String(req.body.access_token || req.query.access_token || '');

    User.getUserByAccessToken(access_token, function (error, user) {
        if (error) {
            // 数据库异常
            eventProxy.throw({code: config.code.db_exception, msg: config.msg.db_exception});
            return;
        }
        if (!user) {
            // token 无效
            eventProxy.throw({code: config.code.invalid_access_token, msg: config.msg.invalid_access_token});
            return;
        }
        if (user.disable) {
            // token 无效
            eventProxy.throw({code: config.code.user_is_disable, msg: config.msg.user_is_disable});
            return;
        }
        req.user = user;
        next();
    });
};
