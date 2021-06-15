/**
 * Create by lzan13 2021/1/13
 * 描述：内容信息校验规则
 */
'use strict';
module.exports = app => {

  /**
   * 校验标题
   */
  app.validator.addRule('title', (rule, value) => {
    if (!/^[\s\S]{1,24}$/.test(value)) {
      return '标题长度必须在 1-24 之间';
    }
  });

  /**
   * 校验描述
   */
  app.validator.addRule('desc', (rule, value) => {
    if (!/^[\s\S]{0,128}$/.test(value)) {
      return '描述文本长度不能超过 128';
    }
  });

  /**
   * 校验内容
   */
  app.validator.addRule('content', (rule, value) => {
    if (!/^[\s\S]{1,800}$/.test(value)) {
      return '内容长度必须在 1-800 之间';
    }
  });

};
