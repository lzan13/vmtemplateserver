/**
 * Created by lzan13 on 2016/12/8.
 * 服务器 API 路由模块儿，在这里定义 api 的接口
 */
var express = require('express');

/**
 * 获取项目路由
 */
var router = express.Router();
// 认证以及 token 相关接口
var authAPI = require('../api/v1/auth');
// 账户相关接口
var userAPI = require('../api/v1/user');
// 测试接口
var testAPI = require('../api/v1/test');

/**
 * 获取七牛 uploadToken
 * 需要在 url 跟着需要上传文件的 key
 */
router.get('/auth/upload_token/:key', authAPI.uploadToken);

/**
 * 注册新账户接口
 */
router.post('/users/create', userAPI.createAndSaveUser);

/**
 * 根据用户名获取单个用户
 */
router.get('/users/:username', userAPI.getUserByUsername);

/**
 * 获取用户列表，需要提供用户名列表参数
 */
router.post('/users/', userAPI.getUsersByNames);

/**
 *  获取好友信息，需要提供好友用户名列表
 */
router.post('/users/friends', userAPI.getUsersByNames);

/**
 * 测试 post 请求，主要测试客户端提交 post 参数
 */
router.post('/tests/post', testAPI.testPost);

// 模块出口
module.exports = router;
