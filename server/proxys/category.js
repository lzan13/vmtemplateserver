/**
 * Created by lzan13 on 2018/4/25.
 */

var mongoose = require('mongoose');
var Category = require('../models').Category;

/**
 * 创建并保存 Category
 */
exports.createAndSaveCategory = function (id, author_id, title, callback) {
    var category = new Category();
    if (id === '') {
        id = mongoose.Types.ObjectId();
    }
    category._id = id;
    category.author_id = author_id;
    category.title = title;
    category.save(callback);
};

/**
 * 删除 Category
 */
exports.removeCategoryById = function (id, callback) {
    Category.deleteOne({_id: id}, callback)
};

/**
 * 根据 id 获取 Category
 */
exports.getCategoryById = function (id, callback) {
    Category.findById(id, callback);
};

/**
 * 根据条件查询 Category
 */
exports.getCategoryByQuery = function (query, opt, callback) {
    Category.find(query, {}, opt, callback);
};
