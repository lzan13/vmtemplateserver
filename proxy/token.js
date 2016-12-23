/**
 * Created by lzan13 on 2016/12/18.
 * Token 代理相关操作模块儿
 */

var Token = require('../models').Token;

/**
 * 保存一个新的 token
 * Callback
 * - error，数据库异常
 * - token，Token
 * @param {String} access_name token 名称
 * @param {String} access_token token 值
 * @param {Function} callback 回调函数
 */
exports.createAndSaveToken = function (access_name, access_token, deadline, callback) {
    var token = new Token();
    token.access_name = access_name;
    token.access_token = access_token;
    token.deadline = deadline;
    token.save(callback);
};

/**
 * 获取 token
 * @param name
 * @param callback
 */
exports.getTokenByName = function (access_name, callback) {
    Token.findOne({access_name: access_name}, callback);
};