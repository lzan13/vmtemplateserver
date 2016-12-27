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
// token 相关模块儿
var tokenAPI = require('../api/v1/token');
// 账户相关模块儿
var userAPI = require('../api/v1/user');
// 好友关系相关模块儿
var friendAPI = require('../api/v1/friend');
// 测试接口
var testAPI = require('../api/v1/test');

/**
 * 认证相关接口
 */
// 获取七牛 uploadToken, 需要在 url 跟着需要上传文件的 key
router.get('/auth/upload-token/:key', tokenAPI.uploadToken);
// 客户端进行登录认证，返回账户 access token
router.post('/auth/token', tokenAPI.token);

/**
 * 用户相关接口
 */
// 注册新账户接口
router.post('/users/create', userAPI.createUser);
// 更新用户信息，需验证账户 token
router.put('/users/update', middleware.auth, userAPI.updateUser);
// 更新用户头像，需验证账户 token
router.put('/users/avatar', middleware.auth, userAPI.updateAvatar);
// 更新用户背景图，需验证账户 token
router.put('/users/cover', middleware.auth, userAPI.updateCover);
// 根据用户名获取用户信息
router.get('/users/:username', userAPI.getUserInfo);

/**
 * 好友关系先关接口
 */
// 添加好友，需验证账户 token
router.put('/friends/:username', middleware.auth, friendAPI.addFriend);
// 删除好友，需验证账户 token
router.delete('/friends/:username', middleware.auth, friendAPI.removeFriend);
// 获取好友信息，需验证账户 token
router.get('/friends/list', middleware.auth, friendAPI.getFriends);
// 获取好友信息，带上用户好友 username 集合参数，需验证账户 token
router.get('/friends/:friends', middleware.auth, userAPI.getFriends);

/**
 * 测试相关接口
 */
// post 请求，主要测试客户端提交 post 参数
router.post('/tests/post', testAPI.testPost);
router.get('/tests/easemobs/token', testAPI.testGetToken);
router.post('/tests/easemobs/users/create', testAPI.testCreateUser);

// 模块出口
module.exports = router;
