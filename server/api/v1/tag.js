/**
 * Created by lzan13 on 2018/4/19.
 */

var EventProxy = require('eventproxy');
var Note = require('../../proxys').Note;
var logger = require('../../log/logger');
var tools = require('../../common/tools');

var config = require('../../config');

/**
 * 获取所有标签
 */
exports.getAllTags = function (req, res, next) {
    var account = req.account;
    var ep = new EventProxy();
    ep.fail(next);
    var query = {author_id: account._id};
    Note.getNotesTags(query, ep.done(function (tags) {
        res.json(tools.reqDone(tags));
    }));
};
