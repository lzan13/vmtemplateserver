var express = require('express');

// 获取项目路由
var router = express.Router();

// 获取注册与登录相关控制器
var signController = require('../controls/sign');

// 获取信息展示相关控制器
var homeController = require('../controls/home');

/**
 * 主页默认路由，指向限制主页面方法
 */
router.get('/', homeController.index);

/**
 * 显示注册路由，指向显示注册页面方法
 */
router.get('/sign_up', signController.signUpView);

/**
 * 注册路由，指向处理注册数据方法
 */
router.post('/sign_up', signController.signUp);

/**
 * 显示登录路由，指向显示登录页面方法
 */
router.get('/sign_in', signController.signInView);

/**
 * 登录路由，指向处理登录信息方法
 */
router.post('/sign_in', signController.signIn);

/**
 * 注销路由，指向处理注销操作方法
 */
router.post('/sign_out', signController.signOut);

// 模块出口
module.exports = router;
