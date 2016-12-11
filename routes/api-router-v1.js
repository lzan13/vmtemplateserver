/**
 * Created by lzan13 on 2016/12/8.
 */
var express = require('express');

// 获取项目路由
var router = express.Router();

// 获取注册与登录相关控制器
var signAPI = require('../api/v1/sign');
var testAPI = require('../api/v1/test');

/**
 * 获取七牛 uploadToken 路由
 */
router.get('/upload_token/:key', signAPI.token);

/**
 * 测试 post 请求，主要测试客户端提价 post 参数
 */
router.post('/test_post', testAPI.testPost);

// 模块出口
module.exports = router;
