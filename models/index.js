/**
 * Created by lzan13 on 2016/9/23.
 * 统一管理数据模型类
 */

var mongoose = require('mongoose');
var config = require('../app.config');

mongoose.connect(
    config.mongodb,
    {server: {poolSize: 20}},
    function (error, db) {
        if (error) {
            console.log(error);
            process.exit(1);
        }
    });

require('./user');

exports.User = mongoose.model('User');