/**
 * Created by lzan13 on 2017/11/10.
 */

var jwt = require('jsonwebtoken');
var EventProxy = require('eventproxy');
var config = require('../config');
var Account = require('../proxys').Account;
var tools = require('./tools');

/**
 * 验证管理员
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.authAdmin = function (req, res, next) {
    var ep = new EventProxy();
    ep.fail(next);
    var token = req.header('Authorization');
    if (!token) {
        return ep.emit('error', tools.reqError(config.code.err_token_invalid, 'token_invalid'));
    }
    token = token.substring(7);
    jwt.verify(token, config.token.secret, function (error) {
        if (error) {
            if (error.name === 'TokenExpiredError') {
                return ep.emit('error', tools.reqError(config.code.err_token_expired, 'token_expired'));
            } else {
                return ep.emit('error', tools.reqError(config.code.err_token_invalid, 'token_invalid'));
            }
        }
        var decoded = jwt.decode(token);
        if (!decoded.adm) {
            return ep.emit('error', tools.reqError(config.code.err_not_permission, 'not_permission'));
        }
        Account.getAccountByToken(token, function (error, account) {
            if (error) {
                return next(error);
            }
            if (!account) {
                return ep.emit('error', tools.reqError(config.code.err_token_invalid, 'token_invalid'));
            }
            req.token = token;
            req.account = account;
            next();
        });
    });
};

/**
 * token 认证
 */
exports.authToken = function (req, res, next) {
    var ep = new EventProxy();
    ep.fail(next);
    var token = req.header('Authorization');
    if (!token) {
        return ep.emit('error', tools.reqError(config.code.err_token_invalid, 'token_invalid'));
    }
    token = token.substring(7);
    jwt.verify(token, config.token.secret, function (error) {
        if (error) {
            if (error.name === 'TokenExpiredError') {
                return ep.emit('error', tools.reqError(config.code.err_token_expired, 'token_expired'));
            } else {
                return ep.emit('error', tools.reqError(config.code.err_token_invalid, 'token_invalid'));
            }
        }
        Account.getAccountByToken(token, function (error, account) {
            if (error) {
                return next(error);
            }
            if (!account) {
                return ep.emit('error', tools.reqError(config.code.err_token_invalid, 'token_invalid'));
            }
            req.token = token;
            req.account = account;
            next();
        });
    });
};