/**
 * Create by lzan13 2020/7/6
 * 描述：公共的帮助类
 */
'use strict';
const crypto = require('crypto');
const moment = require('moment');
const fs = require('fs');
const path = require('path');

/**
 * 数据数据 MD5 加密
 * @param data 加密数据
 */
exports.cryptoMD5 = function(data) {
  const md5 = crypto.createHash('md5');
  md5.update(data);
  return md5.digest('hex');
};

/**
 * 数据进行 SHA1 加密
 * @param data 加密数据
 */
exports.cryptoSHA1 = function(data) {
  const sha1 = crypto.createHash('sha1');
  sha1.update(data);
  return sha1.digest('hex');
};

/**
 * 数据进行 HMACSHA1 加密，一般还需要将签名进行 Base64 加密
 * @param data 加密数据
 */
exports.cryptoHMACSHA1 = function(data, secret) {
  const sha1 = crypto.createHmac('sha1', secret);
  sha1.update(data);
  return sha1.digest();
};

/**
 * 字符串 -> base64
 * @param data 原始数据
 */
exports.strToBase64 = function(data) {
  return new Buffer(data).toString('base64');
};

/**
 * base64 -> 字符串
 * @param data base64 数据
 */
exports.base64ToStr = function(data) {
  return new Buffer(data, 'base64').toString();
};

/**
 * 生成 6 位随机验证码
 * @return {string}
 */
exports.authCode = function() {
  return Math.random()
    .toString()
    .slice(-6);
};

// 格式化时间
exports.formatTime = time => moment(time)
  .format('YYYY-MM-DD HH:mm:ss');

/**
 * 格式化占位符字符串
 */
exports.formatStrs = function(data) {
  const args = Array.prototype.slice.call(arguments, 1);
  return data.replace(/\{(\d+)\}/g, function(m, i) {
    return args[i];
  });
};

/**
 * 同步检查并创建文件夹
 */
exports.syncCreateDirs = function(paths) {
  try {
    if (!fs.existsSync(paths)) {
      let tempPath;
      // 这里指用'/'or'\'分隔目录 如 Linux 的 /let/www/xxx 和 Windows 的 D:\workspace\xxx
      paths.split(/[/\\]/)
        .forEach(function(dirName) {
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
    this.ctx.logger.error(`-lz-helper- 创建目录失败 ${paths} - ${e}`);
    return false;
  }
};

/**
 * ------------------------------------------------------------------
 * 处理响应结果
 */
// 处理成功响应，这里是直接返回结果，为了给签名认证服务器调用
exports.result = ({ ctx, content = '' }) => {
  ctx.body = content;
  ctx.status = 200;
};

// 处理成功响应
exports.success = ({ ctx, msg = '请求成功', data = undefined }) => {
  ctx.body = {
    code: 0,
    msg,
    data,
  };
  ctx.status = 200;
};

// 处理错误响应
exports.error = ({ ctx, code = 400, msg = '请求失败', detail = undefined }) => {
  ctx.body = {
    code,
    msg,
    detail,
  };
  // 虽然处理错误，但是请求是成功的，所以设置返回状态码为 200
  ctx.status = 200;
};
