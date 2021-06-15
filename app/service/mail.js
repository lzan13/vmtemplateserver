/**
 * Create by lzan13 2020/7/7
 * 描述：邮件相关服务
 */
'use strict';

const nodemailer = require('nodemailer');
const Service = require('egg').Service;


/**
 * 发送邮件数据
 */
class EmailService extends Service {
  /**
   * 统一发送方法，也可以直接调用发送，参数格式需要满足一下条件
   * @param data 数据内容，格式如下
   * {
   *   from: 发送方,
   *   to: 接收方,
   *   subject: 邮件主题,
   *   html: 邮件内容（二选一）,
   *   text: 邮件内容（二选一）,
   * }
   */
  async send(data) {
    const { app, ctx } = this;
    const transporter = await nodemailer.createTransport(app.config.mail.config);
    try {
      // 因为发送方必须和认证的邮箱相同，这里为了方式发送 from 出错，再做一次赋值
      data.from = app.config.mail.from;
      await transporter.sendMail(data);
    } catch (e) {
      console.log(`邮件发送失败 ${e}`);
      ctx.throw(500, `邮件发送失败 ${e}`);
      return false;
    }
    console.log('邮件发送成功');
    return true;

  }

  /**
   * 发送验证邮件
   * @param email 邮件地址
   * @param code 验证码
   */
  async sendVerify(email, code) {
    const { app, ctx } = this;
    const verify = ctx.helper.strToBase64(JSON.stringify({ email, code }));
    const html = ctx.helper.formatStrs(app.config.mail.activateContent, email, app.config.host, verify);
    const mailData = {
      from: app.config.mail.from,
      to: email,
      subject: app.config.mail.activateSubject,
      html,
    };
    return this.send(mailData);
  }

  /**
   * 发送验证码
   * @param code 验证码
   */
  async sendCode(email, code) {
    const { app, ctx } = this;
    const html = ctx.helper.formatStrs(app.config.mail.codeContent, email, code);
    const mailData = {
      from: app.config.mail.from,
      to: email,
      subject: app.config.mail.codeSubject,
      html,
    };
    return this.send(mailData);
  }
}

module.exports = EmailService;
