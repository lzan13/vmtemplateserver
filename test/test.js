/**
 * Created by lzan13 on 2016/12/11.
 * 用来测试一些临时接口
 */

// 配置文件
var config = require('../app.config.js');
var loger = require('../common/loger');

// 环信相关接口请求模块儿
var easemob = require('../easemob/em-rest');

/**
 * 构建响应体，并将响应结果返回给接口调用者，结果包含状态以及请求得到的数据
 * {
 *    "status": 0, // 响应状态
 *    "msg": 'Success'
 *    },
 *    "data": {   // 响应的数据
 *        result:result
 *    }
 * }
 */
var result = {status: config.code.no_error, msg: config.msg.success, data: {}};

exports.testPost = function (req, res, next) {
    loger.i("收到请求的 body: value1-" + req.body.key1 + ", value2-" + req.body.key2 + ", value3-" + req.body.key3);
    result.data.result = "测试post 请求正确";
    res.send(result);
};

exports.testGetToken = function (req, res, next) {
    easemob.getToken(function (result) {
        res.send(result);
    });
};

exports.testCreateUser = function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    easemob.createUser(username, password, function (result) {
        res.send(result);
    });
};

exports.testCallback = function (req, res, next) {
    var body = req.body;
    var data = easemob.callback(body);
    res.send(data);
};
