/**
 * Created by lzan13 on 2017/11/9.
 */
var nodemailer = require('nodemailer');
var config = require('../config');
var logger = require('../log/logger');
var tools = require('../common/tools');

var transporter = nodemailer.createTransport(config.mail);

/**
 * 发送邮件数据
 * @param data 数据内容
 */
exports.sendMail = function (data) {
    transporter.sendMail(data, function (error) {
        if (error) {
            logger.e('send mail failed %s', error);
        } else {
            logger.i('send mail success');
        }
    });
};

/**
 * 发送激活邮件
 * @param email 邮件地址
 * @param code 激活码
 */
exports.sendActivateMail = function (email, code) {
    var mailData = {
        from: config.mail_from,
        to: email,
        subject: config.mail_subject_activate,
        html: tools.formatStrs(config.mail_content_activate, email, config.url, email, code)
    };
    this.sendMail(mailData);
};

/**
 * 发送验证码
 * @param code 验证码
 */
exports.sendAuthCodeMail = function (email, code) {
    var mailData = {
        from: config.mail_from,
        to: email,
        subject: config.mail_subject_authcode,
        html: tools.formatStrs(config.mail_content_authcode, email, code)
    };
    this.sendMail(mailData);
};