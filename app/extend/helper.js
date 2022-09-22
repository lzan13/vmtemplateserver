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
 * 构造敏感词 map
 */
exports.makeSensitiveMap = function(list) {
  // 构造根节点
  const result = new Map();
  for (const word of list) {
    let map = result;
    for (let i = 0; i < word.length; i++) {
      // 依次获取字
      const char = word.charAt(i);
      // 判断是否存在
      if (map.get(char)) {
        // 获取下一层节点
        map = map.get(char);
      } else {
        // 将当前节点设置为非结尾节点
        if (map.get('end') === true) {
          map.set('end', false);
        }
        const item = new Map();
        // 新增节点默认为结尾节点
        item.set('end', true);
        map.set(char, item);
        map = map.get(char);
      }
    }
  }
  return result;
};

/**
 * 检查敏感词是否存在
 */
exports.checkSensitiveWord = function(sensitiveMap, content, index) {
  let currentMap = sensitiveMap;
  let flag = false;
  let wordNum = 0;// 记录过滤
  let sensitiveWord = ''; // 记录过滤出来的敏感词
  for (let i = index; i < content.length; i++) {
    const word = content.charAt(i);
    currentMap = currentMap.get(word);
    if (currentMap) {
      wordNum++;
      sensitiveWord += word;
      if (currentMap.get('end') === true) {
        // 表示已到词的结尾
        flag = true;
        break;
      }
    } else {
      break;
    }
  }
  // 两字成词
  if (wordNum < 2) {
    flag = false;
  }
  return { flag, sensitiveWord };
};

/**
 * 判断文本中是否存在敏感词
 */
exports.filterSensitiveWord = function(sensitiveMap, content) {
  const matchs = [];
  // 过滤掉除了中文、英文、数字之外的
  const contentTrim = content.replace(/[^\u4e00-\u9fa5\u0030-\u0039\u0061-\u007a\u0041-\u005a]+/g, '');
  for (let i = 0; i < contentTrim.length; i++) {
    const match = this.checkSensitiveWord(sensitiveMap, contentTrim, i);
    if (match.flag) {
      matchs.push(match);
    }
  }
  let contentReplace = content;
  matchs.forEach(match => {
    contentReplace = contentReplace.replace(match.sensitiveWord, '**');
  });
  return contentReplace;
};

exports.parseMsg = function(action, payload = {}, metadata = {}) {
  const meta = Object.assign(
    {},
    {
      timestamp: Date.now(),
    },
    metadata
  );

  return {
    meta,
    data: {
      action,
      payload,
    },
  };
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
