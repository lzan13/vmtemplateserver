/**
 * Create by lzan13 2021/1/13
 * 描述：用户信息校验规则
 */
'use strict';
module.exports = app => {

  const { validator } = app;

  /**
   * 校验账户
   */
  validator.addRule('account', (rule, value) => {
    if (!/^[a-zA-Z0-9_.@]{4,16}$/.test(value)) {
      return '账户只能包含 a-z A-Z 0-9 _ . @ 且长度在 4-16 之间';
    }
  });

  /**
   * 校验用户名
   */
  validator.addRule('username', (rule, value) => {
    if (!/^[a-zA-Z0-9_.]{4,16}$/.test(value)) {
      return '用户名只能包含 a-z A-Z 0-9 _ . 且长度在 4-16 之间';
    }
  });

  /**
   * 校验手机号
   */
  validator.addRule('phone', (rule, value) => {
    if (!/^[1]([3-9])[0-9]{9}$/.test(value)) {
      return '手机号格式错误';
    }
  });

  /**
   * 校验邮箱
   */
  validator.addRule('email', (rule, value) => {
    if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)) {
      return '邮箱格式错误';
    }
  });

  /**
   * 校验设备 Id
   * Android: 998921b52c7a7b79
   * iOS: 367F5936-39E1-4DFA-8DD2-9542424256BE
   */
  validator.addRule('devicesId', (rule, value) => {
    if (!/^[a-zA-Z0-9_.-]{8,36}$/.test(value)) {
      return '设备 Id 长度异常';
    }
  });

  /**
   * 校验验证码
   */
  validator.addRule('code', (rule, value) => {
    if (!/^[0-9]{6}$/.test(value)) {
      return '验证码格式错误';
    }
  });

  /**
   * 校验密码
   */
  validator.addRule('password', (rule, value) => {
    if (!/^[a-zA-Z0-9_.]{6,20}$/.test(value)) {
      return '密码只能包含 a-z A-Z 0-9 _ . 且长度在 6-20 之间';
    }
  });

  /**
   * 校验生日
   */
  validator.addRule('birthday', (rule, value) => {
    if (!/\d{4}-\d{2}-\d{2}$/.test(value)) {
      return '生日格式必须为 yyyy-mm-dd';
    }
  });

  /**
   * 校验性别
   */
  validator.addRule('gender', (rule, value) => {
    if (!/[0,1,2]$/.test(value)) {
      return '性别只能从[0,1,2]选择一个';
    }
  });

  /**
   * 校验昵称
   */
  validator.addRule('nickname', (rule, value) => {
    if (!/^\S{1,16}$/.test(value)) {
      return '昵称必须为非空字符，长度在 1-16 之间';
    }
  });

  /**
   * 校验签名
   */
  validator.addRule('signature', (rule, value) => {
    if (!/^[\s\S]{2,32}$/.test(value)) {
      return '签名长度必须在 2-32 之间';
    }
  });

  /**
   * 校验地址
   */
  validator.addRule('address', (rule, value) => {
    if (!/^\S{4,64}$/.test(value)) {
      return '地址长度必须在 2-32 之间';
    }
  });

  /**
   * 校验身份证号
   */
  validator.addRule('idCardNumber', (rule, value) => {
    if (!/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(value)) {
      return '身份证号不合法';
    }
  });

};
