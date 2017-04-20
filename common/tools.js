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
var dataToMD5 = function (data) {
    var md5 = crypto.createHash('md5');
    md5.update(data);
    return md5.digest('hex');
};

/**
 * 数据进行 SHA1 加密
 * @param data 加密数据
 */
var dataToSHA1 = function (data) {
    var sha1 = crypto.createHash('sha1');
    sha1.update(data);
    return sha1.digest('hex');
};

/**
 * 格式化字符串方法
 * @param obj
 */
var formatStr = function (obj) {
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
                // try {
                //     if (args[i] instanceof Error) {
                //         return JSON.stringify(args[i++], ['message', 'stack', 'type', 'name']);
                //     } else {
                //         return JSON.stringify(args[i++]);
                //     }
                // } catch (e) {
                //     return '[Circular]';
                // }
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

exports.dataToMD5 = dataToMD5;
exports.dataToSHA1 = dataToSHA1;

exports.formatStr = formatStr;


