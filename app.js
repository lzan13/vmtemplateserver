var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// 实例化一个 express 对象
var app = express();

// 引入路由对象
var apiRoutesV1 = require('./routes/api-router-v1');
var webRoutes = require('./routes/web-router');
// 获取项目全局配置文件
var config = require('./app.config');
app.locals.config = config;

// 设置项目视图引擎，这里使用 ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 设置项目前段浏览器加载时显示的图标
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 设置项目路由
app.use('/api/v1/', cors(), apiRoutesV1);
app.use('/', webRoutes);

/**
 * 错误处理程序，捕捉项目开发中未处理的错误，并进行简单的处理
 * 首先是捕获错误，设置错误信息和错误状态之后，将事件向下传递，由后边的程序进行处理
 */
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/**
 * 开发环境的错误处理部分，这里会将详细的错误信息输出到屏幕，供开发者分析排查
 */
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

/**
 * 生产环境下的错误处理部分，这里将错误拦截处理后，只呈现处理结果，不会将错误的详细信息输出给用户
 */
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
