/**
 * Created by lzan13 on 2016/12/16.
 * API 中间件，主要做一些验证操作
 */

var EventProxy = require('eventproxy');
var config = require('../../app.config');
var User = require('../../proxy').User;

/**
 * 首先对请求进行验证，检查是否有权限进行操作
 * @param req 请求参数
 * @param res 响应数据
 * @param next
 */
exports.auth = function (req, res, next) {
    var response = {status: {}, data: {}};

    var eventProxy = new EventProxy();
    eventProxy.on('error', function (error) {
        response.status = error;
        res.send(response);
    });

    // 获取请求参数中的 access token
    var access_token = String(req.body.access_token || req.query.access_token || '');

    User.getUserByAccessToken(access_token, function (error, user) {
        if (error) {
            // 数据库异常
            eventProxy.emit('error', {code: config.code.db_exception, msg: config.msg.db_exception});
            return;
        }
        if (!user) {
            // token 无效
            eventProxy.emit('error', {code: config.code.invalid_access_token, msg: config.msg.invalid_access_token});
            return;
        }
        if (user.disable) {
            // token 无效
            eventProxy.emit('error', {code: config.code.user_disable, msg: config.msg.user_disable});
            return;
        }
        next();
    });
};
