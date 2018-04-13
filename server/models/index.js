/**
 * Created by lzan13 on 2017/11/9.
 */

var mongoose = require('mongoose');
var config = require('../config');

mongoose.Promise = global.Promise;
mongoose.connect(
    config.mongodb_uri,
    config.mongodb_opts,
    function (error) {
        if (error) {
            console.log(error);
            process.exit(1);
        }
    });

require('./account');
require('./note');

exports.Account = mongoose.model('account');
exports.Note = mongoose.model('note');