/**
 * Created by lzan13 on 2017/11/20.
 */

var mongoose = require('mongoose');
var Note = require('../models').Note;

/**
 * 创建并保存笔记
 */
exports.createAndSaveNote = function (id, author_id, category_id, content, tags, callback) {
    var note = new Note();
    if (id === '') {
        id = mongoose.Types.ObjectId();
    }
    note._id = id;
    note.author_id = author_id;
    note.category_id = category_id;
    note.content = content;
    note.tags = tags;
    note.save(callback);
};

/**
 * 删除笔记
 */
exports.removeNoteById = function (id, callback) {
    Note.deleteOne({_id: id}, callback)
};

/**
 * 永久删除回收站笔记
 */
exports.clearNotesForTrash = function (author_id, callback) {
    Note.deleteMany({author_id: author_id, deleted: true}, callback);
};

/**
 * 根据文章 id 获取笔记信息
 */
exports.getNoteById = function (id, callback) {
    Note.findById(id, callback);
};

/**
 * 根据条件查询笔记
 */
exports.getNotesByQuery = function (query, opt, callback) {
    Note.find(query, {}, opt, callback);
};

/**
 * 获取所有标签
 */
exports.getNotesTags = function (query, callback) {
    Note.distinct('tags', query, callback)
};

/**
 * 查询满足数量的笔记
 */
exports.getNotesCountByQuery = function (query, callback) {
    Note.count(query, callback);
};