/**
 * Created by lzan13 on 2016/12/8.
 * 验证相关接口模块
 */

    // 事件代理
var EventProxy = require('eventproxy');
// 七牛 SDK
var qiniu = require('qiniu');
// 项目配置文件
var config = require('../../app.config');
// 获取用户代理模块
var User = require('../../proxy').User;

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
 * 处理获取七牛上传 Token 请求
 * @param req 请求参数
 * @param res 响应数据
 */
exports.uploadToken = function (req, res, next) {
    // 上传文件的 key，在客户端上传文件时自定义规则生成的 md5 值
    var file_key = req.params.key;

    // 上传到自己在七牛指定的空间
    var bucket = config.qn_bucket_name;

    var spoce = bucket + ':' + file_key;
    // 设置 token 过期时间，单位秒
    var deadline = Math.round(new Date().getTime() / 1000) + 60 * 60;

    // 配置七牛相关的 Access Key 和 Secret Key
    qiniu.conf.ACCESS_KEY = config.qn_access_key;
    qiniu.conf.SECRET_KEY = config.qn_secret_key;

    // 构建上传策略
    var putPolicy = new qiniu.rs.PutPolicy(spoce);
    // 设置 token 过期时间
    putPolicy.deadline = deadline;
    // 生成上传 Token
    var token = putPolicy.token();

    // 响应数据
    result.data.token = token;
    result.data.deadline = deadline;

    // 发送响应结果给请求者
    res.send(result);
};

/**
 * 获取账户 token
 * @param req 请求参数
 * @param res 响应数据
 * @param next
 */
exports.token = function (req, res, next) {
    // 回调代理
    var ep = new EventProxy();

    var username = req.body.username;
    var password = req.body.password;
    var isEmpty = [username, password].some(function (item) {
        return item === '';
    });
    if (isEmpty) {
        // 参数为空
        ep.throw({error: config.code.params_empty, msg: config.msg.params_empty});
        return;
    }
    User.getUserByUsername(username, function (error, user) {
        if (error) {
            // 服务器数据库错误
            ep.throw({code: config.code.db_exception, msg: config.msg.db_exception + error.msg});
            return;
        }
        if (user) {
            User.getUserByUsernameAndKey(username, password, function (error, user) {
                if (user) {
                    result.status.code = config.code.no_error;
                    result.status.msg = config.msg.success;
                    // 响应数据
                    result.data.user = user;
                    // 发送响应结果给请求者
                    res.send(result);
                } else {
                    // 密码错误
                    ep.throw({code: config.code.invalid_password, msg: config.msg.invalid_password});
                    return;
                }
            });
        } else {
            // 用户不存在
            ep.throw({code: config.code.user_not_exist, msg: config.msg.user_not_exist});
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
