/**
 * Create by lzan13 2021/11/18
 * 描述：商品单元测试类
 */
'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/service/config.test.js', () => {
  describe('find()', () => {
    it('初始化配置数据', async () => {
      const ctx = app.mockContext();
      // 先查询下数据量是否和配置一样
      const count = await ctx.model.Config.estimatedDocumentCount();
      if (count === 0) {
        for (const item of app.config.siteList) {
          const profession = await ctx.service.config.create(item);
          assert(profession);
        }
      }
    });
  });
});
