/**
 * Created by lzan13 on 2016/12/11.
 * 用来测试一些临时接口
 */

/**
 * 获取配置文件
 */
var config = require('../../app.config');

var easemob = require('./easemob/em_rest');

exports.testPost = function (req, res, next) {
    console.log("收到请求的 body: value1-" + req.body.key1 + ", value2-" + req.body.key2 + ", value3-" + req.body.key3);
    /**
     * 将请求结果返回给接口调用者，结果包含状态以及请求的数据
     {
        "status": { // 请求结果状态
            "code": 10000,
            "message": 'Success'
        },
        "data": {   // 请求的数据
            result:result
        }
     }
     */
    var response = {status: {code: config.code.no_error, msg: config.msg.success}, data: {}};
    response.data.result = "测试post 请求正确";
    res.send(response);
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
