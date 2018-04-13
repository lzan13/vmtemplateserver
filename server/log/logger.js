/**
 * Created by lzan13 on 2018/1/8.
 */
var log4js = require('log4js');
var tools = require('../common/tools');
var config = require('./config.json');

var env;
var logger;

levels = {
    'trace': log4js.levels.TRACE,
    'debug': log4js.levels.DEBUG,
    'info': log4js.levels.INFO,
    'warn': log4js.levels.WARN,
    'error': log4js.levels.ERROR,
    'fatal': log4js.levels.FATAL
};

var stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/i;
var stackReg2 = /at\s+()(.*):(\d*):(\d*)/i;

/**
 * 配置 log4js
 */
log4js.configure(config);
/**
 * 设置 express 使用 log4js 中间件
 */
exports.use = function (app) {
    env = app.get('env');
    app.use(log4js.connectLogger(log4js.getLogger('http'), {level: 'auto'}));
    logger = log4js.getLogger('default');
};

/**
 * debug 日志
 */
exports.d = function () {
    if (env !== 'development') {
        return;
    }
    var stack = getStackTrace();
    var msg = tools.formatStr.apply(null, arguments);
    var logMsg = '[' + stack.path + ':' + stack.line + '] ' + msg;
    logger.debug(logMsg);
};

/**
 * 正常日志
 */
exports.i = function () {
    var stack = getStackTrace();
    var msg = tools.formatStr.apply(null, arguments);
    var logMsg = '[' + stack.path + ':' + stack.line + '] ' + msg;
    logger.info(logMsg);
};

/**
 * 警告日志
 */
exports.w = function () {
    var stack = getStackTrace();
    var msg = tools.formatStr.apply(null, arguments);
    var logMsg = '[' + stack.path + ':' + stack.line + '] ' + msg;
    logger.warn(logMsg);
};

/**
 * 错误日志
 */
exports.e = function () {
    var stack = getStackTrace();
    var msg = tools.formatStr.apply(null, arguments);
    var logMsg = '[' + stack.path + ':' + stack.line + '] ' + msg;
    logger = log4js.getLogger('error');
    logger.error(logMsg);
};

/**
 * 获取堆栈踪迹
 * @returns {*|Array}
 */
var getStackTrace = function () {
    // 剔除当前类封装的几层，直接获取到方法调用点
    var stacks = (new Error()).stack.split('\n').slice(3);
    // 获取剔除其他干扰项之后的第一个堆栈信息
    var s = stacks[0];
    var sp = stackReg.exec(s) || stackReg2.exec(s);
    var data = {};
    if (sp && sp.length === 5) {
        data.method = sp[1];
        data.path = sp[2];
        data.line = sp[3];
        data.pos = sp[4];
    }
    return data;
};