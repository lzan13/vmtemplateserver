/**
 * Create by lzan13 on 2016/9/23.
 * 项目前端路由
 */
var express = require('express');
// 获取项目路由
var router = express.Router();
// 获取注册与登录相关控制器
var sign = require('../controls/sign');
// 获取信息展示相关控制器
var home = require('../controls/home');

// 主页
router.get('/', home.index);

// 显示注册页面
router.get('/signup', sign.signUpView);
// 注册账户
router.post('/signup', sign.signUp);
// 显示登录界面
router.get('/signin', sign.signInView);
// 登录
router.post('/signin', sign.signIn);
// 退出账户
router.post('/signout', sign.signOut);


// 模块出口
module.exports = router;
