/**
 * Created by lzan13 on 2017/11/8.
 * 账户相关 api 接口实现类
 */

var Formidable = require("formidable");
var fs = require("fs");
var path = require("path");
var EventProxy = require('eventproxy');
var Account = require('../../proxys').Account;
var auth = require('../../common/auth');
var mail = require('../../common/mail');
var tools = require('../../common/tools');
var logger = require('../../log/logger');
var config = require('../../config');

/**
 * 通过邮箱创建新账户
 */
exports.createAccountByEmail = function (req, res, next) {
    var email = req.body.email || '';
    var password = req.body.password || '';

    // 事件代理，解决回调嵌套问题
    var ep = new EventProxy();
    ep.fail(next);

    var error;
    if (email === '') {
        error = '邮箱为空';
    } else if (password === '') {
        error = '密码为空';
    }
    if (error) {
        return ep.emit('error', tools.reqError(config.code.err_invalid_param, error));
    }

    // 查询账户是否存在
    var query = { '$or': [{ username: email }, { email: email }, { phone: email }] };
    Account.getAccountByQuery(query, {}, ep.done(function (accounts) {
        if (accounts.length > 0) {
            return ep.emit('error', tools.reqError(config.code.err_account_exist, '账户已存在'));
        }
        // 创建并保存账户
        var code = 'V' + tools.authCode();
        Account.createAndSaveAccount(email, password, code, ep.done(function (account) {
            mail.sendActivateMail(account.email, code);
            return res.json(tools.reqDone(account));
        }));
    }));
};

/**
 * 登录账户
 */
exports.loginAccount = function (req, res, next) {
    var account = req.body.account;
    var password = req.body.password;

    var ep = new EventProxy();
    ep.fail(next);

    var query = { '$or': [{ username: account }, { email: account }, { phone: account }] };
    Account.authAccount(query, ep.done(function (accounts) {
        if (accounts.length <= 0) {
            return ep.emit('error', tools.reqError(config.code.err_account_not_exist, '账户不存在'));
        }
        var account = accounts[0];
        if (account.password !== tools.cryptoSHA1(password)) {
            return ep.emit('error', tools.reqError(config.code.err_invalid_password, '密码错误'));
        }
        if (!account.verified) {
            return ep.emit('error', tools.reqError(config.code.err_account_no_verified, '账户未认证'));
        }
        if (account.deleted) {
            return ep.emit('error', tools.reqError(config.code.err_account_deleted, '账户已被删除'));
        }
        account.token = auth.createToken(account.email, account.admin);
        account.save(ep.done(function (account) {
            res.json(tools.reqDone(account));
        }));
    }));
};

/**
 * 更新账户信息
 */
exports.updateAccountInfo = function (req, res, next) {
    var account = req.account;

    var ep = new EventProxy();
    ep.fail(next);

    account.gender = req.body.gender;
    account.nickname = req.body.nickname;
    account.signature = req.body.signature;
    account.address = req.body.address;

    account.save(ep.done(function (account) {
        res.json(tools.reqDone(account));
    }));
};

/**
 * 更新账户密码
 */
exports.updateAccountPassword = function (req, res, next) {
    var account = req.account;
    var oldPassword = req.body.oldPassword;
    var password = req.body.password;

    var ep = new EventProxy();
    ep.fail(next);
    if (tools.cryptoSHA1(oldPassword) !== account.password) {
        return ep.emit('error', tools.reqError(config.code.err_invalid_password, '密码错误'));
    }
    account.password = password;
    account.token = createToken(account.email, account.admin);
    account.save(ep.done(function (account) {
        res.json(tools.reqDone({
            token: account.token,
            expiresIn: config.token.expires
        }));
    }));
};


/**
 * 更新头像
 */
exports.updateAccountAvatar = function (req, res, next) {
    var account = req.account;

    var ep = new EventProxy();
    ep.fail(next);

    var form = new Formidable.IncomingForm();
    form.parse(req, function (error, faileds, files) {
        if (error) {
            return ep.emit('error', tools.reqError(config.code.err_upload_avatar_failed, '更新头像失败' + faileds));
        }
        logger.i('解析文件完成 path:%s, name:%s', files.upload.path, files.upload.name);
        var extname = path.extname(files.upload.name);
        var avatar = './data/upload/images/' + account.id + '_avatar' + extname;
        fs.writeFileSync(avatar, fs.readFileSync(files.upload.path));
        account.avatar = avatar;
        account.save(ep.done(function (account) {
            return res.json(tools.reqDone(account));
        }));
    });
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
        res.json(tools.reqDone(account));
    }));
};

/**
 * 认证账户邮箱
 */
exports.verifyAccountEmail = function (req, res, next) {
    var email = req.query.email;
    var code = req.query.code;
    var query = { '$or': [{ username: email }, { email: email }, { phone: email }] };

    var ep = new EventProxy();
    ep.fail(next);

    Account.authAccount(query, ep.done(function (accounts) {
        if (accounts.length <= 0) {
            return ep.emit('error', tools.reqError(config.code.err_account_not_exist, '账户不存在'));
        }
        var account = accounts[0];
        if (!account.verified) {
            if (code !== account.code) {
                return ep.emit('error', tools.reqError(config.code.err_invalid_verify_link, '无效的认证链接'))
            }
            account.code = null;
            account.verified = true;
            account.save(ep.done(function (account) {
                res.json(tools.reqDone('账户认证完成'));
            }));
        } else {
            res.json(tools.reqDone('账户已认证'))
        }
    }));
};

/**
 * 获取账户信息
 */
exports.getAccountDetail = function (req, res, next) {
    var id = req.params.id || '';

    var ep = new EventProxy();
    ep.fail(next);

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return ep.emit('error', tools.reqError(config.code.err_invalid_param, '参数错误'));
    }

    Account.getAccountById(id, ep.done(function (account) {
        if (!account) {
            return ep.emit('error', tools.reqError(config.code.err_account_not_exist, '账户不存在'));
        }
        res.json(tools.reqDone(account));
    }));
};

/**
 * 搜索账户
 */
exports.searchAccounts = function (req, res, next) {
    var q = req.query.q;
    query = { '$or': [{ username: q }, { email: q }, { phone: q }] };
    query.deleted = false;
    // 分页
    var page = parseInt(req.query.page, 10) || 1;
    page = page > 0 ? page : 1;
    var limit = Number(req.query.limit) || config.limit_default;
    // 设置排序参数
    var options = { skip: (page - 1) * limit, limit: limit };

    var ep = new EventProxy();
    ep.fail(next);
    Account.getAccountByQuery(query, options, ep.done(function (accounts) {
        if (accounts.length === 0) {
            return ep.emit('error', tools.reqError(config.code.err_account_not_exist, 'account_not_exist'));
        }
        res.json(tools.reqDone(accounts[0]));
    }));
};
