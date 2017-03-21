/**
 * Created by lzan13 on 2016/9/26.
 * 自己封装的工具类，实现一些可供公共调用的方法
 */

var crypto = require('crypto');

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

exports.dataToMD5 = dataToMD5;
exports.dataToSHA1 = dataToSHA1;

