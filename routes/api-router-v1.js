/**
 * Created by lzan13 on 2016/12/8.
 * 服务器 API 路由模块儿，在这里定义 api 的接口
 */
var express = require('express');

/**
 * 获取项目路由
 */
var router = express.Router();
// 获取注册与登录相关控制器
var signAPI = require('../api/v1/sign');
var testAPI = require('../api/v1/test');

/**
 * 获取七牛 uploadToken
 * 需要在 url 跟着需要上传文件的 key
 */
router.get('/tokens/upload/:key', signAPI.token);

/**
 * 测试 post 请求，主要测试客户端提交 post 参数
 */
router.post('/tests/post', testAPI.testPost);

// 获取好友信息，需要提供好友用户名列表
// router.post('/users/firends',);

// 模块出口
module.exports = router;
