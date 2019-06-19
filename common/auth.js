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
        return ep.emit('error', tools.reqError(config.code.err_token_invalid, '无效的 Token'));
    }
    token = token.substring(7);
    jwt.verify(token, config.token.secret, function (error) {
        if (error) {
            if (error.name === 'TokenExpiredError') {
                return ep.emit('error', tools.reqError(config.code.err_token_expired, 'Token 过期，请重新登录'));
            } else {
                return ep.emit('error', tools.reqError(config.code.err_token_invalid, '无效的 Token'));
            }
        }
        Account.getAccountByToken(token, function (error, account) {
            if (error) {
                return next(error);
            }
            if (!account) {
                return ep.emit('error', tools.reqError(config.code.err_token_invalid, '无效的 Token'));
            }
            req.token = token;
            req.account = account;
            next();
        });
    });
};


/**
 * 使用 jwt 模块生成 token
 */
exports.createToken = function (email, admin) {
    // Claims (Payload)
    // sub(subject): 该JWT所面向的用户 The subject of the token, token 主题(账户名或用户 id)
    // iss(issuer): 该JWT的签发者 The issuer of the token, token 是给谁的(网站地址，特殊标识等)
    // iat(issued at): 在什么时候签发的 token Issued At, 创建时间(Unix 时间戳格式)
    // exp(expires): token什么时候过期 Expiration Time, token 过期时间(Unix 时间戳格式)
    // nbf(not before)：token在此时间之前不能被接收处理(Unix 时间戳格式)
    // jti(jwtid)：JWT ID为web token提供唯一标识
    var createAt = Math.trunc(Date.now() / 1000);
    var token = jwt.sign({
        sub: email,
        adm: admin,
        iat: createAt,
        exp: createAt + config.token.expires,
        nbf: createAt,
    }, config.token.secret);
    return token;
}
