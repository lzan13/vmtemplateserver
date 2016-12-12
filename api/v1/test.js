/**
 * Created by lzan13 on 2016/12/11.
 * 用来测试一些临时接口
 */

/**
 * 获取事件代理模块儿，解决回调嵌套问题
 */
var EventProxy = require('eventproxy');

/**
 * 获取配置文件
 */
var config = require('../../app.config');

var testPost = function (req, res, next) {
    console.log("收到请求的 body: " + req.body.key1 + req.body.key2);
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
    var response = {};
    var status = {};
    status.code = config.error_no;
    status.msg = 'Success';
    response.status = status;
    var data = {};
    data.result = "测试post 请求正确";
    response.data = data;
    res.send(response);
};

exports.testPost = testPost;