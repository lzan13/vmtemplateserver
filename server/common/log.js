/**
 * Created by lzan13 on 2017/1/4.
 * 简单封装日志输出类
 */

var moment = require('moment');
var tools = require('./tools');

var info = "[info]";
var debug = "[debug]";
var error = "[error]";
var trace = "[trace]";

var stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/i;
var stackReg2 = /at\s+()(.*):(\d*):(\d*)/i;

// 控制台输出样式
var styles = {
    // 重置所有属性
    'none': '\x1b[0m',
    // 加粗/高亮
    'bold': '\x1b[1m',
    // 下划线
    'underline': '\x1b[4m',
    // 翻转
    'inverse': '\x1b[7m',
    // 重置加粗/高亮
    'resetBold': '\x1b[22m',
    // 文本颜色
    'black': '\x1b[31m',
    'red': '\x1b[31m',
    'green': '\x1b[32m',
    'yellow': '\x1b[33m',
    'blue': '\x1b[34m',
    'magenta': '\x1b[35m',
    'cyan': '\x1b[36m',
    'white': '\x1b[37m',
    // 重置文本颜色
    'reset': '\x1b[39m',

    // 文本背景颜色
    'blackBG': '\x1b[40m',
    'redBG': '\x1b[41m',
    'greenBG': '\x1b[42m',
    'yellowBG': '\x1b[43m',
    'blueBG': '\x1b[44m',
    'magentaBG': '\x1b[45m',
    'cyanBG': '\x1b[46m',
    'whiteBG': '\x1b[47m',
    // 重置文本背景颜色
    'resetBG': '\x1b[49m'
};

/**
 * 正常日志消息
 */
exports.i = function () {
    var time = '[' + moment().format('YYYY-MM-DD HH:mm:ss.SSS') + '] ';
    var stack = getStackTrace();
    var msg = tools.formatStr.apply(null, arguments);
    var logMsg = time + styles.bold + styles.green + info + '  [' + stack.path + ':' + stack.line + '] ' + msg + styles.none;
    console.log(logMsg);

};

/**
 * debug 级别日志输出
 */
exports.d = function () {
    var time = '[' + moment().format('YYYY-MM-DD HH:mm:ss.SSS') + '] ';
    var stack = getStackTrace();
    var msg = tools.formatStr.apply(null, arguments);
    var logMsg = time + styles.bold + styles.blue + debug + ' [' + stack.path + ':' + stack.line + '] ' + msg + styles.none;
    console.log(logMsg);
};

/**
 * 错误级别日志输出
 */
exports.e = function () {
    var time = '[' + moment().format('YYYY-MM-DD HH:mm:ss.SSS') + '] ';
    var stack = getStackTrace();
    var msg = tools.formatStr.apply(null, arguments);
    var logMsg = time + styles.bold + styles.red + error + ' [' + stack.path + ':' + stack.line + '] ' + msg + styles.none;
    console.log(logMsg);
};

