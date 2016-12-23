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

require('./friend');
require('./token');
require('./user');

exports.Friend = mongoose.model('Friend');
exports.Token = mongoose.model('Token');
exports.User = mongoose.model('User');