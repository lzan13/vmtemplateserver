/**
 * Created by lzan13 on 2016/9/26.
 * 自己封装的工具类，实现一些可供公共调用的方法
 */

let crypto = require('crypto');
let util = require('util');
let fs = require("fs");
let path = require("path");

let logger = require('../log/logger');

let formatRegExp = /%[sdj]/g;

/**
 * 数据数据 MD5 加密
 * @param data 加密数据
 */
exports.cryptoMD5 = function (data) {
    let md5 = crypto.createHash('md5');
    md5.update(data);
    return md5.digest('hex');
};

/**
 * 数据进行 SHA1 加密
 * @param data 加密数据
 */
exports.cryptoSHA1 = function (data) {
    let sha1 = crypto.createHash('sha1');
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
    let args = arguments;
    let i = 0;
    if (typeof obj !== 'string') {
        let objects = [];
        for (; i < args.length; i++) {
            objects.push(util.inspect(args[i]));
        }
        return objects.join(' ');
    }

    i = 1;
    let str = String(obj).replace(formatRegExp, function (x) {
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
    for (let len = args.length, x = args[i]; i < len; x = args[++i]) {
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
    let args = Array.prototype.slice.call(arguments, 1);
    return objs.replace(/\{(\d+)\}/g, function (m, i) {
        return args[i];
    });
};

/**
 * 同步检查并创建文件夹
 */
exports.syncMkdirs = function (paths) {
    try {
        if (!fs.existsSync(paths)) {
            let tempPath;
            // 这里指用'/'or'\'分隔目录  如 Linux 的 /let/www/xxx 和 Windows 的 D:\workspace\xxx
            paths.split(/[/\\]/).forEach(function (dirName) {
                if (tempPath) {
                    tempPath = path.join(tempPath, dirName);
                } else {
                    tempPath = dirName;
                }
                if (!fs.existsSync(tempPath)) {
                    if (!fs.mkdirSync(tempPath)) {
                        return false;
                    }
                }
            });
        }
        return true;
    } catch (e) {
        logger.e("创建目录失败 path:%s, msg:%s", paths, e);
        return false;
    }
}

/**
 * 成功的请求结果
 */
exports.reqDone = function (data, totalCount) {
    let result = {
        code: 0,
        message: 'success'
    };
    if (totalCount) {
        result.total_count = totalCount;
        result.result_count = data.length;
    }
    result.data = data;
    return result
};

/**
 * 错误的请求结果
 */
exports.reqError = function (code, msg) {
    return {
        code: code,
        message: msg,
        status: 200
    }
};


