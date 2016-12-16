/**
 * Created by lzan13 on 2016/12/8.
 * 服务器 API 路由模块儿，在这里定义 api 的接口
 */
var express = require('express');

/**
 * 获取项目路由
 */
var router = express.Router();
// 中间件
var middleware = require('../api/v1/middleware');
// 认证以及 token 相关接口
var authAPI = require('../api/v1/auth');
// 账户相关接口
var userAPI = require('../api/v1/user');
// 测试接口
var testAPI = require('../api/v1/test');

/**
 * 认证相关接口
 */
// 获取七牛 uploadToken, 需要在 url 跟着需要上传文件的 key
router.get('/auth/upload_token/:key', authAPI.uploadToken);
// 客户端进行登录认证，返回账户 access token
router.post('/auth/token', authAPI.token);

/**
 * 用户相关接口
 */
// 注册新账户接口
router.post('/users/create', userAPI.createUser);
// 更新用户信息
router.put('/users/update', middleware.auth, userAPI.updateUser);
// 更新用户头像
router.put('/users/avatar', middleware.auth, userAPI.updateAvatar);
// 更新用户背景图
router.put('/users/cover', middleware.auth, userAPI.updateCover);
// 根据用户名获取用户信息
router.get('/users/:username', userAPI.getUserInfo);
// 添加好友
router.put('/users/firends/:username', userAPI.addFriend);
// 删除好友
router.delete('/users/firends/:username', userAPI.addFriend);
// 获取好友信息，需要提供好友用户名列表
router.get('/users/:username/friends/:friends', middleware.auth, userAPI.getFriendsInfo);

/**
 * 测试相关接口
 */
// post 请求，主要测试客户端提交 post 参数
router.post('/tests/post', testAPI.testPost);

// 模块出口
module.exports = router;
