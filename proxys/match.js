/**
 * Created by lzan13 on 2018/4/25.
 */

let mongoose = require('mongoose');
let Match = require('../models').Match;

/**
 * 创建并保存 Match
 */
exports.createAndSaveMatch = function (account_id, callback) {
    let match = new Match();
    id = mongoose.Types.ObjectId();
    match._id = id;
    match.account_id = account_id;
    match.save(callback);
};

/**
 * 删除 Match
 */
exports.removeMategoryById = function (id, callback) {
    Match.deleteOne({ _id: id }, callback)
};

/**
 * 根据 id 获取 Match
 */
exports.getMatchById = function (id, callback) {
    Match.findById(id, callback);
};

/**
 * 根据条件查询 Match
 */
exports.getMatchByQuery = function (query, opt, callback) {
    Match.find(query, {}, opt, callback);
};
