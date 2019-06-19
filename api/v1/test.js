/**
 * Created by lzan13 on 2018/1/5.
 */

var logger = require('../../log/logger');
var tools = require('../../common/tools');
var config = require('../../config');

exports.testFormatStr = function (req, res, next) {
    var name = req.body.name;
    var result = tools.formatStrs(config.mail_content_activate, name, name, name);
    var yu = 2 & 3;
    var huo = 2 | 3;
    var fei = 1 ^ 3;
    var left = 2 << 1;
    var right = 2 >> 1;
    logger.d('format str result: &: %d, |: %d, ^: %d, <<: %d, >>: %d', yu, huo, fei, left, right);
    res.json({code: 0, msg: 'success', data: 'test'});
};