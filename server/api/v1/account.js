/**
 * Created by lzan13 on 2017/11/8.
 * 账户相关 api 接口实现类
 */

var jwt = require('jsonwebtoken');
var EventProxy = require('eventproxy');
var Account = require('../../proxys').Account;
var mail = require('../../common/mail');
var tools = require('../../common/tools');
var logger = require('../../log/logger');
var config = require('../../config');

/**
 * 创建新账户
 */
exports.createAccountByEmail = function (req, res, next) {
    var account = req.body.account || '';
    var password = req.body.password || '';
    var ep = new EventProxy();
    ep.fail(next);

    var error;
    if (account === '') {
        error = 'account_is_null';
    } else if (password === '') {
        error = 'password_is_null';
    }
    if (error) {
        return ep.emit('error', tools.reqResult(config.code.err_invalid_param, error));
    }

    ep.all('exist', 'count', function (exist, count) {
        if (exist) {
            return ep.emit('error', tools.reqResult(config.code.err_account_exist, 'account_exist'));
        }
        var name = 'v' + (count + 1);
        var code = 'V-' + tools.authCode();
        Account.createAndSaveAccount(name, account, password, code, ep.done(function (account) {
            mail.sendActivateMail(account, code);
            res.json(tools.reqResult(0, 'success', account));
        }));
    });

    var query = {'$or': [{name: account}, {email: account}, {phone: account}]};
    Account.getAccountByQuery(query, {}, ep.done(function (accounts) {
        return ep.emit('exist', accounts.length > 0 ? true : false);
    }));

    Account.getAccountCount({}, ep.done(function (count) {
        return ep.emit('count', count);
    }));
};

/**
 * 更新账户名
 */
exports.updateAccountName = function (req, res, next) {
    var token = req.token;
    var account = req.account;
    var name = req.body.name;
    var ep = new EventProxy();
    ep.fail(next);
    if (!name) {
        return ep.emit('error', tools.reqResult(config.code.err_invalid_param, 'invalid_param'));
    }
    Account.getAccountByName(name, ep.done(function (exist) {
        if (exist && token !== exist.token) {
            return ep.emit('error', tools.reqResult(config.code.err_account_name_exist, 'err_account_name_exist'));
        }
        account.name = name;
        account.save(ep.done(function (account) {
            res.json(tools.reqResult(0, 'success', account));
        }));
    }));
};

/**
 * 更新头像
 */
exports.updateAccountAvatar = function (req, res, next) {
    var account = req.account;
    var avatar = req.body.avatar;
    var ep = new EventProxy();
    ep.fail(next);
    account.avatar = avatar;
    account.save(ep.done(function (account) {
        res.json(tools.reqResult(0, 'success', account));
    }));
};

/**
 * 更新封面
 */
exports.updateAccountCover = function (req, res, next) {
    var account = req.account;
    var cover = req.body.cover;
    var ep = new EventProxy();
    ep.fail(next);
    account.cover = cover;
    account.save(ep.done(function (account) {
        res.json(tools.reqResult(0, 'success', account));
    }));
};

/**
 * 更新账户信息
 */
exports.updateAccountInfo = function (req, res, next) {
    var account = req.account;
    var gender = req.body.gender;
    var address = req.body.address;
    var nickname = req.body.nickname;
    var description = req.body.description;
    var ep = new EventProxy();
    ep.fail(next);
    account.gender = gender;
    account.address = address;
    account.nickname = nickname;
    account.description = description;
    account.save(ep.done(function (account) {
        res.json(tools.reqResult(0, 'success', account));
    }));
};

/**
 * 修改密码
 */
exports.changePassword = function (req, res, next) {
    var token = req.token;
    var account = req.account;
    var oldPassword = req.body.oldPassword;
    var password = req.body.password;

    var ep = new EventProxy();
    ep.fail(next);
    if (tools.cryptoSHA1(oldPassword) !== account.password) {
        return ep.emit('error', tools.reqResult(config.code.err_invalid_password, 'invalid_password'));
    }
    account.password = password;
    account.token = createToken(account.email, account.admin);
    account.save(ep.done(function (account) {
        res.json(tools.reqResult(0, 'success', {
            token: account.token,
            expiresIn: config.token.expires
        }));
    }));
};

/**
 * 激活账户
 */
exports.activateAccount = function (req, res, next) {
    var activateAccount = req.query.account;
    var activateCode = req.query.code;
    var query = {'$or': [{name: activateAccount}, {email: activateAccount}, {phone: activateAccount}]};
    var ep = new EventProxy();
    ep.fail(next);
    Account.authAccount(query, ep.done(function (accounts) {
        if (accounts.length <= 0) {
            return ep.emit('error', tools.reqResult(config.code.err_account_not_exist, 'account_not_exist'));
        }
        var account = accounts[0];
        if (!account.activated) {
            if (activateCode !== account.code) {
                return ep.emit('error', tools.reqResult(config.code.err_invalid_activate_link, 'invalid_activate_link'))
            }
            account.code = null;
            account.activated = true;
            account.save(ep.done(function (account) {
                res.json(tools.reqResult(0, 'success', 'account activate success'));
            }));
        } else {
            res.json(tools.reqResult(0, 'success', 'account activate success'))
        }
    }));
};

/**
 * 账户认证，一般用来客户端登录
 */
exports.authAccount = function (req, res, next) {
    var account = req.body.account;
    var password = req.body.password;
    var query = {'$or': [{name: account}, {email: account}, {phone: account}]};
    var ep = new EventProxy();
    ep.fail(next);
    Account.authAccount(query, ep.done(function (accounts) {
        if (accounts.length <= 0) {
            return ep.emit('error', tools.reqResult(config.code.err_account_not_exist, 'account_not_exist'));
        }
        var account = accounts[0];
        if (account.password !== tools.cryptoSHA1(password)) {
            return ep.emit('error', tools.reqResult(config.code.err_invalid_password, 'invalid_password'));
        }
        if (!account.activated) {
            return ep.emit('error', tools.reqResult(config.code.err_account_no_activated, 'account_no_activated'));
        }
        if (account.deleted) {
            return ep.emit('error', tools.reqResult(config.code.err_account_deleted, 'account_deleted'));
        }
        account.token = createToken(account.email, account.admin);
        account.save(ep.done(function (account) {
            res.json(tools.reqResult(0, 'success', account));
        }));
    }));
};

/**
 * 使用 jwt 模块生成 token
 */
function createToken(email, admin) {
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

/**
 * 获取单个账户
 */
exports.getAccount = function (req, res, next) {
    var name = req.params.name;
    query = {'$or': [{name: name}, {email: name}, {phone: name}]};
    var ep = new EventProxy();
    ep.fail(next);
    Account.getAccountByQuery(query, {}, ep.done(function (accounts) {
        if (accounts.length === 0) {
            return ep.emit('error', tools.reqResult(config.code.err_account_not_exist, 'account_not_exist'));
        }
        res.json(tools.reqResult(0, 'success', accounts[0]));
    }));
};

/**
 * 搜索账户
 */
exports.searchAccounts = function (req, res, next) {
    var q = req.query.q;
    query = {'$or': [{name: q}, {email: q}, {phone: q}]};
    query.deleted = false;
    // 分页
    var page = parseInt(req.query.page, 10) || 1;
    page = page > 0 ? page : 1;
    var limit = Number(req.query.limit) || config.default_limit;
    // 设置排序参数
    var options = {skip: (page - 1) * limit, limit: limit};

    var ep = new EventProxy();
    ep.fail(next);
    Account.getAccountByQuery(query, options, ep.done(function (accounts) {
        if (accounts.length === 0) {
            return ep.emit('error', tools.reqResult(config.code.err_account_not_exist, 'account_not_exist'));
        }
        res.json(tools.reqResult(0, 'success', accounts[0]));
    }));
};
