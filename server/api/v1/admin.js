/**
 * Created by lzan13 on 2018/4/13.
 * 管理员相关接口
 */

var EventProxy = require('eventproxy');
var Account = require('../../proxys').Account;
var config = require('../../config');

/**
 * 获取全部账户
 */
exports.getAllAccounts = function (req, res, next) {
    var query = {deleted: false};
    // 分页
    var page = parseInt(req.query.page, 10) || 1;
    page = page > 0 ? page : 1;
    var limit = Number(req.query.limit) || config.default_limit;
    // 按照更新时间排序
    var options = {skip: (page - 1) * limit, limit: limit};

    var ep = new EventProxy();
    ep.fail(next);
    Account.getAccountByQuery(query, options, ep.done(function (accounts) {
        if (accounts.length === 0) {
            return ep.emit('error', {code: config.code.err_account_not_exist, message: 'account_not_exist'});
        }
        res.json({code: 0, message: 'success', data: accounts[0]});
    }));
};