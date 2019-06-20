/**
 * Created by lzan13 on 2017/11/8.
 * api 路由类
 */

var express = require('express');
var router = express.Router();

var auth = require('./common/auth');
var storage = require('./common/storage');
var account = require('./api/v1/account');

var test = require('./api/v1/test');

/**
 * 测试接口
 */
router.post('/test', test.testFormatStr);

/**
 * Account 路由配置
 */
// 创建账户
router.post('/accounts/create', account.createAccountByEmail);
// 登录账户
router.post('/accounts/login', account.loginAccount);

// 更新账户信息
router.put('/accounts/detail', auth.authToken, account.updateAccountInfo);
// 更新账户密码 
router.put('/accounts/password', auth.authToken, account.updateAccountPassword);
// 更新账户头像
router.put('/accounts/avatar', auth.authToken, account.updateAccountAvatar);
// 更新账户封面
router.put('/accounts/cover', auth.authToken, account.updateAccountCover);

// 认证账户邮箱
router.get('/accounts/verify', account.verifyAccountEmail);

// 获取账户信息
router.get('/accounts/detail/:id', account.getAccountDetail);
// 搜索账户
router.get('/accounts/search', auth.authToken, account.searchAccounts);

module.exports = router;
