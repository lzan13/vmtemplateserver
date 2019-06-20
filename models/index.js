/**
 * Created by lzan13 on 2017/11/9.
 */

let mongoose = require('mongoose');
let config = require('../config');

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
require('./match');

exports.Account = mongoose.model('account');
exports.Match = mongoose.model('match');