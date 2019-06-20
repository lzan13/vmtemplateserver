/**
 * Created by lzan13 on 2018/4/25.
 */

/**
 * Created by lzan13 on 2017/11/11.
 */

let EventProxy = require('eventproxy');
let Match = require('../../proxys').Match;
let logger = require('../../log/logger');
let tools = require('../../common/tools');

let config = require('../../config');

/**
 * 创建 Match
 */
exports.createMatch = function (req, res, next) {
    let account = req.account;

    logger.i(account);

    let ep = new EventProxy();
    ep.fail(next);

    let query = { account_id: account._id };
    Match.getMatchByQuery(query, {}, ep.done(function (matchs) {
        if (matchs.length > 0) {
            let match = matchs[0];
            // 这里主要是更新下时间
            match.save(ep.done(function (match) {
                return res.json(tools.reqDone(match));
            }));
        } else {
            // 没有则新建
            Match.createAndSaveMatch(account._id, ep.done(function (match) {
                return res.json(tools.reqDone(match));
            }));
        }
    }));
};

/**
 * 删除 Match
 */
exports.removeMatch = function (req, res, next) {
    let id = req.params.id;

    let ep = new EventProxy();
    ep.fail(next);

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return ep.emit('error', tools.reqError(config.code.err_invalid_param, '参数不合法'));
    }
    Match.getMatchById(id, ep.done(function (match) {
        if (!match) {
            return ep.emit('error', tools.reqError(config.code.err_match_not_exist, '匹配信息不存在'));
        }
        Match.removeMategoryById(id, ep.done(function (result) {
            res.json(tools.reqDone(result.result));
        }));
    }));
};

/**
 * 获取全部 Match 可分页
 */
exports.getMatchAll = function (req, res, next) {
    let account = req.account;
    let query = {};

    // 分页
    let page = parseInt(req.query.page, 10) || 1;
    page = page > 0 ? page : 1;
    let limit = Number(req.query.limit) || config.limit_default;
    let skipCount = (page - 1) * limit;
    // 按照更新时间排序
    let options = { skip: skipCount, limit: limit, sort: '-update_at' };

    let ep = new EventProxy();
    ep.fail(next);

    Match.getMatchByQuery(query, options, ep.done(function (matchs) {
        res.json(tools.reqDone(matchs));
    }));
};