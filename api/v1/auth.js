/**
 * Created by lzan13 on 2016/12/8.
 * 验证相关接口模块
 */

/**
 * 七牛 SDK
 */
var qiniu = require('qiniu');
/**
 * 项目配置文件
 */
var config = require('../../app.config');

/**
 * 处理获取七牛上传 Token 请求
 * @param req
 * @param res
 */
exports.uploadToken = function (req, res, next) {
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

    // 响应状态
    response.status.code = config.code.normal;
    response.status.msg = config.msg.success;
    // 响应数据
    response.data.token = token;
    response.data.deadline = deadline;

    // 发送响应结果给请求者
    res.send(response);
};
