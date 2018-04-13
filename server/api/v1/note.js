/**
 * Created by lzan13 on 2017/11/11.
 */

var EventProxy = require('eventproxy');
var Account = require('../../proxys').Account;
var Note = require('../../proxys').Note;
var logger = require('../../log/logger');
var tools = require('../../common/tools');

var config = require('../../config');

/**
 * 创建笔记
 */
exports.createNote = function (req, res, next) {
    var token = req.token;
    var account = req.account;
    var content = req.body.content;
    var tags = req.body.tags || '';
    var error;
    if (content === null) {
        error = 'content_is_null';
    }
    if (error) {
        return res.json({code: config.code.err_invalid_param, message: error});
    }
    var tagArr;
    if (tags !== '') {
        tagArr = tags.split(',');
    }
    var ep = new EventProxy();
    ep.fail(next);
    Note.createAndSaveNote(account.id, content, tagArr, ep.done(function (article) {
        res.json({code: 0, msg: 'success', data: article});
    }));
};

/**
 * 删除笔记到回收站
 */
exports.addNoteToTrash = function (req, res, next) {
    var token = req.token;
    var account = req.account;
    var id = req.params.id;
    var ep = new EventProxy();
    ep.fail(next);
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return ep.emit('error', {code: config.code.err_invalid_param, message: 'invalid_id_format'})
    }
    Note.getNoteById(id, ep.done(function (article) {
        if (!article) {
            return ep.emit('error', {code: config.code.err_article_not_exist, message: 'article_not_exist'})
        }
        if (article.authorId !== account.id) {
            return ep.emit('error', {code: config.code.err_not_permission, message: 'not_permission'})
        }
        article.deleted = true;
        article.save(ep.done(function (result) {
            res.json({code: 0, msg: 'success', data: result});
        }));
    }));
};

/**
 * 从回收站恢复笔记
 */
exports.restoreNoteForTrash = function (req, res, next) {
    var token = req.token;
    var account = req.account;
    var id = req.params.id;
    var ep = new EventProxy();
    ep.fail(next);
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return ep.emit('error', {code: config.code.err_invalid_param, message: 'invalid_id_format'})
    }
    Note.getNoteById(id, ep.done(function (article) {
        if (!article) {
            return ep.emit('error', {code: config.code.err_article_not_exist, message: 'article_not_exist'})
        }
        if (article.authorId !== account.id) {
            return ep.emit('error', {code: config.code.err_not_permission, message: 'not_permission'})
        }
        article.deleted = false;
        article.save(ep.done(function (result) {
            res.json({code: 0, msg: 'success', data: result});
        }));
    }));
};
/**
 * 永久删除笔记
 */
exports.removeNoteForEvery = function (req, res, next) {
    var token = req.token;
    var account = req.account;
    var id = req.params.id;
    var ep = new EventProxy();
    ep.fail(next);
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return ep.emit('error', {code: config.code.err_invalid_param, message: 'invalid_id_format'})
    }
    Note.getNoteById(id, ep.done(function (article) {
        if (!article) {
            return ep.emit('error', {code: config.code.err_article_not_exist, message: 'article_not_exist'})
        }
        if (article.authorId !== account.id) {
            return ep.emit('error', {code: config.code.err_not_permission, message: 'not_permission'})
        }
        Note.removeNoteById(id, ep.done(function (result) {
            res.json({code: 0, msg: 'success', data: result});
        }));
    }));
};

/**
 * 清空回收站
 */
exports.clearNotesForTrash = function (req, res, next) {
    var token = req.token;
    var account = req.account;
    var ep = new EventProxy();
    ep.fail(next);
    Note.clearNotesForTrash(account.id, ep.done(function (result) {
        res.json({code: 0, msg: 'success', data: result});
    }));
};
/**
 * 更新笔记
 */
exports.updateNote = function (req, res, next) {
    var token = req.token;
    var account = req.account;
    var id = req.params.id;
    var content = req.body.content;
    var tags = req.body.tags;

    var ep = new EventProxy();
    ep.fail(next);
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return ep.emit('error', {code: config.code.err_invalid_param, message: 'invalid_id_format'})
    }
    Note.getNoteById(id, function (error, article) {
        if (!article) {
            // 如果文章不存在，直接新建
            return ep.emit('error', {code: config.code.err_article_not_exist, message: 'article_not_exist'})
        }
        if (article.authorId !== account.id) {
            return ep.emit('error', {code: config.code.err_not_permission, message: 'not_permission'})
        }

        var tagArr;
        if (tags !== '') {
            tagArr = tags.split(',');
        }
        article.content = content;
        article.tags = tagArr;
        article.save(ep.done(function (article) {
            res.json({code: 0, msg: 'success', data: article});
        }));
    });
};

/**
 * 获取指定笔记
 */
exports.getNoteById = function (req, res, next) {
    var id = req.params.id;
    var ep = new EventProxy();
    ep.fail(next);
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return ep.emit('error', {code: config.code.err_invalid_param, message: 'invalid_id_format'})
    }
    Note.getNoteById(id, function (error, article) {
        if (error) {
            return next(error);
        }
        if (!article) {
            return ep.emit('error', {code: config.code.err_article_not_exist, message: 'article_not_exist'})
        }
        res.json({code: 0, msg: 'success', data: article});
    });
};

/**
 * 获取回收站的笔记
 */
exports.getNotesForTrash = function (req, res, next) {
    var token = req.token;
    var account = req.account;
    var ep = new EventProxy();
    ep.fail(next);
    var query = {authorId: account.id, deleted: true};
    Note.getNotesByQuery(query, {}, ep.done(function (articles) {
        res.json({code: 0, message: 'success', data: articles});
    }));
};

/**
 * 获取全部笔记，可分页
 */
exports.getAllNotes = function (req, res, next) {
    var query = {deleted: false};
    // 作者 id
    var author = req.query.authorId;
    if (author) {
        query.authorId = author;
    }
    // tags
    var tags = req.query.tags;
    if (tags) {
        var tagArr = tags.split(',');
        query.tags = {'$all': tagArr};
    }
    // 分页
    var page = parseInt(req.query.page, 10) || 1;
    page = page > 0 ? page : 1;
    var limit = Number(req.query.limit) || config.default_limit;
    // 按照更新时间排序
    var options = {skip: (page - 1) * limit, limit: limit, sort: '-update_at'};
    var ep = new EventProxy();
    ep.fail(next);
    Note.getNotesByQuery(query, options, ep.done(function (articles) {
        res.json({code: 0, message: 'success', data: articles});
    }));
};

/**
 * 获取所有标签
 */
exports.getAllTags = function (req, res, next) {
    var token = req.token;
    var account = req.account;
    var ep = new EventProxy();
    ep.fail(next);
    var query = {authorId: account.id};
    Note.getNotesTags(query, ep.done(function (result) {
        res.json({code: 0, message: 'success', data: result});
    }));
};