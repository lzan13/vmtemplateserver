/*
 * Created by lzan13 on
 * 封装调用环信 rest 接口模块儿
 */

var EventProxy = require('eventproxy');
// 网络请求框架
var request = require('request');
var Token = require('../../../proxy').Token;

// 项目配置文件
var config = require('../../../app.config');
var org_name = config.em_org_name;
var app_name = config.em_app_name;
var baseUrl = config.em_base_url + org_name + "/" + app_name;
// access token
var access_token = '';
// token 过期时间
var deadline = 0;
// 是否已经过期
var isExpires = false;

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
 * 封装 rest 请求接口，通过传递请求参数和回调接口，统一由 request 进行发送请求
 * @param data 请求参数
 * @param callback 回调函数
 */
var requestEasemob = function (data, callback) {
    var data = data || {};

    // 构建请求参数，其中url 选项为必须
    var options = {};
    options.method = data.method;
    options.uri = baseUrl + data.uri;
    options.json = true;
    options.headers = data.headers;
    options.body = data.body;

    request(options, callback)
};

/**
 * 获取 rest token
 * Callback
 * - token, token 内容，包含 access_token 和过期时间
 * @param callback 回调函数
 */
exports.getToken = function (callback) {



    var currTime = Math.round(new Date().getTime() / 1000);
    // 判断 accessToken 是否可用，防止每次都去重新获取 token
    if (!isExpires) {
        if (access_token === '' || deadline === 0) {
            // 首先从本地查找 token，如果存在且未过期直接返回
            Token.getTokenByName(config.em_access_token, function (error, token) {
                if (token) {
                    if (token.deadline > currTime) {
                        result.data.access_token = token.access_token;
                        result.data.deadline = token.deadline;
                        return callback(result);
                    }
                }
            });
        } else if (access_token !== '' && deadline > currTime) {
            result.data.access_token = access_token;
            result.data.deadline = deadline;
            return callback(result);
        }
    }

    var client_id = config.em_client_id;
    var client_secret = config.em_client_secret;
    var data = {
        method: 'POST',
        uri: '/token',
        headers: {
            'content-type': 'application/json'
        },
        body: {
            grant_type: 'client_credentials',
            client_id: client_id,
            client_secret: client_secret
        }
    };
    // 进行网络请求，获取新的 token
    requestEasemob(data, function (error, response, body) {
        if (error) {
            // 设置 token 过期状态为 true
            isExpires = true;
            result.status.code = config.code.data_is_empty;
            result.status.msg = config.msg.data_is_empty;
            return callback(result);
        }
        // 设置 token 过期状态为 false
        isExpires = false;
        // 给全局 token 变量和 deadline 赋值
        access_token = body.access_token;
        deadline = Math.round(new Date().getTime() / 1000) + body.expires_in;
        result.data.access_token = access_token;
        result.data.deadline = deadline;
        // 保存 token 信息到本地
        Token.createAndSaveToken(config.em_access_token, access_token, deadline, function (error, token) {
            if (error) {
                console.log('token save failed, because db exception');
            }
            console.log('token save success');
            callback(result);
        });
    });
};

/**
 * 创建新账户
 * @param username 账户名
 * @param password 账户密码
 */
exports.createUser = function (username, password, callback) {
    getToken(function (result) {
        if (result.status.code !== config.code.no_error) {
            return callback(result);
        }
        var data = {
            method: 'POST',
            uri: '/usres',
            headers: {
                'content-type': 'application/json',
                'authorization': 'bearer ' + result.data.access_token
            },
            body: {
                username: username,
                password: password
            }
        };
        requestEasemob(data, function (error, response, body) {
                if (error) {
                    console.log(error);
                    result.status.code = config.code.request_failed;
                    result.status.msg = error;
                    callback(result);
                }
                if (response.code === 401) {
                    isExpires = true;
                    result.status.code = config.code.no_permission_action;
                    result.status.msg = config.msg.no_permission_action;
                    callback(result);
                }

                result.data.body = body;
                callback(result);
            }
        );
    });

};


