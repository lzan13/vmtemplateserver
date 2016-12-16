/**
 * Created by lzan13 on 16/9/20.
 * 注册登录相关控制器，主要处理和登录注册相关的操作
 */

/**
 * 获取事件代理模块儿，解决回调嵌套问题
 */
var EventProxy = require('eventproxy');

/**
 * 获取配置文件
 */
var config = require('../app.config');

/**
 * 获取用户代理模块
 */
var User = require('../proxy').User;

/**
 * 处理 get 方式注册请求，显示注册界面
 * @param req 请求参数
 * @param res 响应数据
 */
exports.signUpView = function (req, res) {
    res.render('sign/sign_up');
};

/**
 * 处理 post 方式的注册请求方法
 * @param req 请求数据，包含注册参数信息
 * @param res 响应数据，包含处理结果信息
 */
exports.signUp = function (req, res) {
    // 构建响应数据
    var eventProxy = new EventProxy();
    // 错误处理程序
    eventProxy.on('error', function (error) {
        res.render('sign/sign_up', {error: error});
    });

    // 获取请求提交的数据
    var username = req.body.username;
    var password = req.body.password;

    // 校验数据，判断必须数据是否有空值
    var isEmpty = [username, password].some(function (item) {
        return item === '' || typeof (item) === 'undefined';
    });
    if (isEmpty) {
        // 参数为空
        eventProxy.emit('error', {code: config.code.params_empty, msg: config.msg.params_empty});
        return;
    }
    User.getUserByUsername(username, function (error, user) {
        if (error) {
            // 服务器数据库错误
            eventProxy.emit('error', {code: config.code.db_exception, msg: config.msg.db_exception});
            return;
        }
        if (user) {
            // 用户已存在
            eventProxy.emit('error', {code: config.code.user_already_exist, msg: config.msg.user_already_exist});
            return;
        }
        User.createAndSaveUser(username, password, function (error, result) {
            if (result) {
                // 注册成功，跳转到登录页，或直接登录跳转到主页面
                var success = {code: config.code.no_error, msg: config.msg.success};
                res.render('sign/sign_in', {success: success});
            } else {
                // 注册失败
                eventProxy.emit('error', {code: config.code.sign_up_failed, msg: config.msg.sign_up_failed});
                return;
            }
        });
    });
};

/**
 * 处理 get 方式的登录请求，展示登录界面
 * @param req
 * @param res
 */
exports.signInView = function (req, res) {
    res.render('sign/sign_in');
};

/**
 * 处理 post 方式的登录请求，处理登录逻辑和结果
 * @param req
 * @param res
 */
exports.signIn = function (req, res) {
    var eventProxy = new EventProxy();
    // 错误处理程序
    eventProxy.on('error', function (error) {
        res.render('sign/sign_in', {error: error});
    });

    var username = req.body.username;
    var password = req.body.password;
    var isEmpty = [username, password].some(function (item) {
        return item === '' || typeof (item) === 'undefined';
    });
    if (isEmpty) {
        // 参数为空
        eventProxy.emit('error', {error: config.code.params_empty, msg: config.msg.params_empty});
        return;
    }
    User.getUserByUsername(username, function (error, user) {
        if (user) {
            if (user.password !== password) {
                // 密码无效
                eventProxy.emit('error', {error: config.code.invalid_password, msg: config.msg.invalid_password});
                return;
            }
            req.session.user = user;
            res.render('/', {success: {code: config.code.no_error, msg: config.msg.success}});
        } else {
            // 用户不存在
            eventProxy.emit('error', {error: config.code.user_not_exist, msg: config.msg.user_not_exist});
            return;
        }
    });

};

/**
 * 处理注销请求
 * @param req
 * @param res
 */
exports.signOut = function (req, res) {
    req.session.destory();
    // 退出登录之后重定向到主页
    res.redirect('/');
};
