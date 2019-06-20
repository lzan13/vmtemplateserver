/**
 * Created by lzan13 on 2018/1/5.
 */

let logger = require('../../log/logger');
let tools = require('../../common/tools');
let config = require('../../config');

exports.testFormatStr = function (req, res, next) {
    let name = req.body.name;
    let result = tools.formatStrs(config.mail_content_activate, name, name, name);
    let yu = 2 & 3;
    let huo = 2 | 3;
    let fei = 1 ^ 3;
    let left = 2 << 1;
    let right = 2 >> 1;
    logger.d('format str result: &: %d, |: %d, ^: %d, <<: %d, >>: %d', yu, huo, fei, left, right);
    res.json({ code: 0, msg: 'success', data: 'test' });
};