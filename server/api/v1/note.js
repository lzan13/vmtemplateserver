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
    var account = req.account;
    var content = req.body.content;
    var tags = req.body.tags || '';
    logger.d(req.body);
    var ep = new EventProxy();
    ep.fail(next);

    var error;
    if (content === null) {
        error = 'content_is_null';
    }
    if (error) {
        return ep.emit('error', tools.reqError(config.code.err_invalid_param, error));
    }

    var tagArr;
    if (tags !== '') {
        tagArr = tags.split(',');
    }
    Note.createAndSaveNote(account.id, content, tagArr, ep.done(function (note) {
        account.note_count += 1;
        account.save();
        res.json(tools.reqDone(note));
    }));
};

/**
 * 更新笔记
 */
exports.updateNote = function (req, res, next) {
    var account = req.account;
    var id = req.params.id;
    var content = req.body.content;
    var tags = req.body.tags;

    var ep = new EventProxy();
    ep.fail(next);
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return ep.emit('error', tools.reqError(config.code.err_invalid_param, 'invalid_id_format'));
    }
    Note.getNoteById(id, function (error, note) {
        if (!note) {
            return ep.emit('error', tools.reqError(config.code.err_note_not_exist, 'note_not_exist'));
        }
        if (note.authorId !== account.id) {
            return ep.emit('error', tools.reqError(config.code.err_not_permission, 'not_permission'));
        }

        var tagArr;
        if (tags !== '') {
            tagArr = tags.split(',');
        }
        note.content = content;
        note.tags = tagArr;
        note.save(ep.done(function (note) {
            res.json(tools.reqDone(note));
        }));
    });
};

/**
 * 删除笔记到回收站
 */
exports.addNoteToTrash = function (req, res, next) {
    var account = req.account;
    var id = req.params.id;
    var ep = new EventProxy();
    ep.fail(next);
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return ep.emit('error', tools.reqError(config.code.err_invalid_param, 'invalid_id_format'));
    }
    Note.getNoteById(id, ep.done(function (note) {
        if (!note) {
            return ep.emit('error', tools.reqError(config.code.err_note_not_exist, 'note_not_exist'));
        }
        if (note.authorId !== account.id) {
            return ep.emit('error', tools.reqError(config.code.err_not_permission, 'not_permission'));
        }
        note.deleted = true;
        note.save(ep.done(function (note) {
            res.json(tools.reqDone(note));
        }));
    }));
};

/**
 * 从回收站恢复笔记
 */
exports.restoreNoteForTrash = function (req, res, next) {
    var account = req.account;
    var id = req.params.id;
    var ep = new EventProxy();
    ep.fail(next);
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return ep.emit('error', tools.reqError(config.code.err_invalid_param, 'invalid_id_format'));
    }
    Note.getNoteById(id, ep.done(function (note) {
        if (!note) {
            return ep.emit('error', tools.reqError(config.code.err_note_not_exist, 'note_not_exist'));
        }
        if (note.authorId !== account.id) {
            return ep.emit('error', tools.reqError(config.code.err_not_permission, 'not_permission'));
        }
        note.deleted = false;
        note.save(ep.done(function (note) {
            res.json(tools.reqDone(note));
        }));
    }));
};
/**
 * 永久删除笔记
 */
exports.removeNoteForever = function (req, res, next) {
    var account = req.account;
    var id = req.params.id;
    var ep = new EventProxy();
    ep.fail(next);
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return ep.emit('error', tools.reqError(config.code.err_invalid_param, 'invalid_id_format'));
    }
    Note.getNoteById(id, ep.done(function (note) {
        if (!note) {
            return ep.emit('error', tools.reqError(config.code.err_note_not_exist, 'note_not_exist'));
        }
        if (note.authorId !== account.id) {
            return ep.emit('error', tools.reqError(config.code.err_not_permission, 'not_permission'));
        }
        Note.removeNoteById(id, ep.done(function (result) {
            account.note_count -= result.n;
            account.save(ep.done(function (account) {
                res.json(tools.reqDone(account));
            }));
        }));
    }));
};

/**
 * 清空回收站
 */
exports.clearNotesForTrash = function (req, res, next) {
    var account = req.account;
    var ep = new EventProxy();
    ep.fail(next);
    Note.clearNotesForTrash(account.id, ep.done(function (result) {
        account.note_count -= result.n;
        account.save(ep.done(function (account) {
            res.json(tools.reqDone(account));
        }));
    }));
};

/**
 * 获取指定笔记
 */
exports.getNoteById = function (req, res, next) {
    var id = req.params.id;
    var ep = new EventProxy();
    ep.fail(next);
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return ep.emit('error', tools.reqError(config.code.err_invalid_param, 'invalid_id_format'));
    }
    Note.getNoteById(id, function (error, note) {
        if (error) {
            return next(error);
        }
        if (!note) {
            return ep.emit('error', tools.reqError(config.code.err_note_not_exist, 'note_not_exist'));
        }
        res.json(tools.reqDone(note));
    });
};

/**
 * 获取回收站的笔记
 */
exports.getNotesForTrash = function (req, res, next) {
    var account = req.account;
    var query = {authorId: account.id, deleted: true};

    // 分页
    var page = parseInt(req.query.page, 10) || 1;
    page = page > 0 ? page : 1;
    var limit = Number(req.query.limit) || config.default_limit;
    var skipCount = (page - 1) * limit;
    // 按照更新时间排序
    var options = {skip: skipCount, limit: limit, sort: '-update_at'};

    var ep = new EventProxy();
    ep.fail(next);
    Note.getNotesCountByQuery(query, ep.done(function (totalCount) {
        Note.getNotesByQuery(query, options, ep.done(function (notes) {
            res.json(tools.reqDone(notes, totalCount - skipCount));
        }));
    }));
};

/**
 * 获取全部笔记，可按照条件查询分页等
 */
exports.getAllNotes = function (req, res, next) {
    var account = req.account;
    var query = {authorId: account.id, deleted: false};
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
    var skipCount = (page - 1) * limit;
    // 按照更新时间排序
    var options = {skip: skipCount, limit: limit, sort: '-update_at'};

    var ep = new EventProxy();
    ep.fail(next);
    Note.getNotesCountByQuery(query, ep.done(function (totalCount) {
        Note.getNotesByQuery(query, options, ep.done(function (notes) {
            res.json(tools.reqDone(notes, totalCount - skipCount));
        }));
    }));
};

/**
 * 查询特定条件的笔记数量
 */
exports.getNotesCount = function (req, res, next) {
    var account = req.account;
    var query = {authorId: account.id};
    // tags
    var tags = req.query.tags;
    if (tags) {
        var tagArr = tags.split(',');
        query.tags = {'$all': tagArr};
    }
    var deleted = req.query.deleted || false;
    query.deleted = deleted;

    var ep = new EventProxy();
    ep.fail(next);
    Note.getNotesCountByQuery(query, ep.done(function (count) {
        res.json(tools.reqDone(count));
    }));
};

/**
 * 搜索笔记
 */
exports.searchNotes = function (req, res, next) {
    var account = req.account;
    var query = {authorId: account.id, deleted: false};
    var q = req.query.q;
    if (q) {
        var re = new RegExp(q, 'i');
        var or = '$or';
        query[or] = [{'content': re}];
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
    var skipCount = (page - 1) * limit;
    // 按照更新时间排序
    var options = {skip: skipCount, limit: limit, sort: '-update_at'};

    var ep = new EventProxy();
    ep.fail(next);
    logger.d(query);
    Note.getNotesCountByQuery(query, ep.done(function (totalCount) {
        Note.getNotesByQuery(query, options, ep.done(function (notes) {
            res.json(tools.reqDone(notes, totalCount - skipCount));
        }));
    }));
};

/**
 * 增量更新同步数据
 */
exports.syncNotes = function (req, res, next) {
    var account = req.account;
    var query = {authorId: account.id};
    // 修改时间，这里作为客户端增量更新同步的 key
    var syncKey = req.query.syncKey;
    if (syncKey) {
        query.update_at = {"$gt": syncKey};
    }
    // 分页
    var page = parseInt(req.query.page, 10) || 1;
    page = page > 0 ? page : 1;
    var limit = Number(req.query.limit) || config.default_limit;
    var skipCount = (page - 1) * limit;
    // 按照更新时间排序
    var options = {skip: skipCount, limit: limit, sort: 'update_at'};

    var ep = new EventProxy();
    ep.fail(next);
    Note.getNotesCountByQuery(query, ep.done(function (totalCount) {
        Note.getNotesByQuery(query, options, ep.done(function (notes) {
            res.json(tools.reqDone(notes, totalCount - skipCount));
        }));
    }));
};
