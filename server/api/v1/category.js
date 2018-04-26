/**
 * Created by lzan13 on 2018/4/25.
 */

/**
 * Created by lzan13 on 2017/11/11.
 */

var EventProxy = require('eventproxy');
var Category = require('../../proxys').Category;
var Note = require('../../proxys').Note;
var logger = require('../../log/logger');
var tools = require('../../common/tools');

var config = require('../../config');

/**
 * 创建 Category
 */
exports.createCategory = function (req, res, next) {
    var account = req.account;
    var id = req.body.id || '';
    var title = req.body.title || '';

    var ep = new EventProxy();
    ep.fail(next);

    var error;
    if (title === '') {
        error = 'category_title_is_null';
    }
    if (error) {
        return ep.emit('error', tools.reqError(config.code.err_invalid_param, error));
    }
    var query = {'$or': [{_id: id}, {title: title}]};
    Category.getCategoryByQuery(query, {}, ep.done(function (categorys) {
        if (categorys.length > 0) {
            return ep.emit('error', tools.reqError(config.code.err_category_exist, 'category_exist'));
        }
        Category.createAndSaveCategory(id, account._id, title, ep.done(function (category) {
            res.json(tools.reqDone(category));
        }));
    }));
};

/**
 * 更新 Category
 */
exports.updateCategory = function (req, res, next) {
    var id = req.params.id || '';
    var title = req.body.title || '';

    var ep = new EventProxy();
    ep.fail(next);

    var error;
    if (id === '') {
        error = 'category_id_is_null';
    }
    if (title === '') {
        error = 'title_is_null';
    }
    if (error) {
        return ep.emit('error', tools.reqError(config.code.err_invalid_param, error));
    }
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return ep.emit('error', tools.reqError(config.code.err_invalid_param, 'invalid_id_format'));
    }
    Category.getCategoryById(id, ep.done(function (category) {
        if (!category) {
            return ep.emit('error', tools.reqError(config.code.err_category_not_exist, 'category_not_exist'));
        }
        category.title = title;
        category.save(ep.done(function (category) {
            res.json(tools.reqDone(category));
        }));
    }));
};

/**
 * 删除 Category
 */
exports.removeCategory = function (req, res, next) {
    var id = req.params.id;

    var ep = new EventProxy();
    ep.fail(next);

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return ep.emit('error', tools.reqError(config.code.err_invalid_param, 'invalid_id_format'));
    }
    var query = {category_id: id};
    Note.getNotesByQuery(query, {}, ep.done(function (notes) {
        if (notes.length > 0) {
            return ep.emit('error', tools.reqError(config.code.err_category_unable_remove, 'category_has_note'));
        }
        Category.getCategoryById(id, ep.done(function (category) {
            if (!category) {
                return ep.emit('error', tools.reqError(config.code.err_category_not_exist, 'category_not_exist'));
            }
            Category.removeCategoryById(id, ep.done(function (removeResult) {
                res.json(tools.reqDone(removeResult.result));
            }));
        }));
    }));
};

/**
 * 获取 Category
 */
exports.getCategoryById = function (req, res, next) {
    var id = req.params.id;
    var ep = new EventProxy();
    ep.fail(next);
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return ep.emit('error', tools.reqError(config.code.err_invalid_param, 'invalid_id_format'));
    }
    Category.getCategoryById(id, ep.done(function (category) {
        if (!category) {
            return ep.emit('error', tools.reqError(config.code.err_category_not_exist, 'category_not_exist'));
        }
        res.json(tools.reqDone(category));
    }));
};

/**
 * 获取全部 Category
 */
exports.getAllCategory = function (req, res, next) {
    var account = req.account;
    var query = {author_id: account._id};

    var ep = new EventProxy();
    ep.fail(next);

    Category.getCategoryByQuery(query, {}, ep.done(function (categorys) {
        res.json(tools.reqDone(categorys));
    }));
};