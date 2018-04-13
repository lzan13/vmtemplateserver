/**
 * Created by lzan13 on 2017/11/9.
 */
var nodemailer = require('nodemailer');
var config = require('../config');
var logger = require('../log/logger');
var tools = require('../common/tools');

var transporter = nodemailer.createTransport(config.mail);

exports.sendMail = function (data) {
    transporter.sendMail(data, function (error) {
        if (error) {
            logger.e('send mail failed %s', error);
        } else {
            logger.i('send mail success');
        }
    });
};

exports.sendActivateMail = function (email, code) {
    var mailData = {
        from: config.mail_from,
        to: email,
        subject: config.mail_subject_activate,
        html: tools.formatStrs(config.mail_content_activate, email, email, code)
    };
    this.sendMail(mailData);
};

exports.sendAutocodeMail = function (code) {
    this.sendMail(data);
};