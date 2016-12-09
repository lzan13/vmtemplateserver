/**
 * Created by lzan13 on 2016/12/8.
 * 登录注册以及验证相关接口模块
 */

/**
 * 获取事件代理模块儿，解决回调嵌套问题
 */
var EventProxy = require('eventproxy');

/**
 * 七牛 sdk
 */
var qiniu = require('qiniu');

/**
 * 获取配置文件
 */
var config = require('../../app.config');

/**
 * 处理获取七牛上传 Token 请求
 * @param req
 * @param res
 */
var token = function (req, res, next) {
    // 上传文件的 key，在客户端上传文件时自定义规则生成的 md5 值
    var file_key = req.params.key;

    // 上传到自己在七牛指定的空间
    var bucket = config.qn_bucket_name;

    var spoce = bucket + ":" + file_key;
    // 设置 token 过期时间，单位秒
    var deadline = 1 * 60 * 60;

    // 配置七牛相关的 Access Key 和 Secret Key
    qiniu.conf.ACCESS_KEY = config.qn_access_key;
    qiniu.conf.SECRET_KEY = config.qn_secret_key;

    // 构建上传策略
    var putPolicy = new qiniu.rs.PutPolicy(spoce);
    // 设置 token 过期时间
    putPolicy.deadline = Math.round(new Date().getTime() / 1000) + deadline;
    // 生成上传 Token
    token = putPolicy.token();

    // 将获取结果返回给接口调用者
    res.send({success: true, deadline: putPolicy.deadline, token: token});
};

exports.token = token;
