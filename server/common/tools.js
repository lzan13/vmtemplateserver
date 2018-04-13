/**
 * Created by lzan13 on 2016/9/26.
 * 自己封装的工具类，实现一些可供公共调用的方法
 */

var crypto = require('crypto');
var util = require('util');

var formatRegExp = /%[sdj]/g;

/**
 * 数据数据 MD5 加密
 * @param data 加密数据
 */
exports.cryptoMD5 = function (data) {
    var md5 = crypto.createHash('md5');
    md5.update(data);
    return md5.digest('hex');
};

/**
 * 数据进行 SHA1 加密
 * @param data 加密数据
 */
exports.cryptoSHA1 = function (data) {
    var sha1 = crypto.createHash('sha1');
    sha1.update(data);
    return sha1.digest('hex');
};

/**
 * 生成 6 位随机验证码
 * @returns {string}
 */
exports.authCode = function () {
    return Math.random().toString().slice(-6);
};

/**
 * 格式化字符串方法
 * @param obj
 */
exports.formatStr = function (obj) {
    var args = arguments;
    var i = 0;
    if (typeof obj !== 'string') {
        var objects = [];
        for (; i < args.length; i++) {
            objects.push(util.inspect(args[i]));
        }
        return objects.join(' ');
    }

    i = 1;
    var str = String(obj).replace(formatRegExp, function (x) {
        switch (x) {
            case '%s':
                return String(args[i++]);
            case '%d':
                return Number(args[i++]);
            case '%j':
                return JSON.stringify(args[i++]);
            default:
                return x;
        }
    });
    for (var len = args.length, x = args[i]; i < len; x = args[++i]) {
        if (x === null || typeof x !== 'object') {
            str += ' ' + x;
        } else {
            str += ' ' + util.inspect(x);
        }
    }
    return str;
};

/**
 * 格式化占位符字符串
 */
exports.formatStrs = function (objs) {
    if (objs.length == 0) {
        return null;
    }
    var args = Array.prototype.slice.call(arguments, 1);
    return objs.replace(/\{(\d+)\}/g, function (m, i) {
        return args[i];
    });
};


