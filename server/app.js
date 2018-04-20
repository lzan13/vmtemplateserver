/**
 * 程序入口
 */
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('./log/logger.js');

var config = require('./config');

// 引入 api 路由
var apiRouter = require('./api_router_v1');

// 实例化 express 对象
var app = express();

// 设置日志中间件
logger.use(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

/**
 * 设置 api 路由
 */
app.use('/v1', apiRouter);

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
 * 错误处理
 */
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    var result = {code: err.code || err.status, status: err.status, message: err.message};
    if (app.get('env') === 'development') {
        result.error = err.stack;
    }
    result.status = undefined;
    res.json(result);
});

module.exports = app;
