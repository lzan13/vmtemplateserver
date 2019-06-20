/**
 * Created by lzan13 on 2017/11/8.
 * api 路由类
 */

let express = require('express');
let router = express.Router();

let auth = require('./common/auth');

let account = require('./api/v1/account');
let match = require('./api/v1/match');

let test = require('./api/v1/test');

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
// 获取所有账户，可分页
router.get('/accounts/all', account.getAccountAll);
// 搜索账户
router.get('/accounts/search', auth.authToken, account.searchAccounts);

// 提交匹配信息
router.post('/matchs/create', auth.authToken, match.createMatch);
// 移除匹配信息
router.delete('/matchs/remove/:id', auth.authToken, match.removeMatch);
// 查询全部匹配信息，可分页
router.get('/matchs/all', auth.authToken, match.getMatchAll);

module.exports = router;
