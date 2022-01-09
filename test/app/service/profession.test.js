/**
 * Create by lzan13 2021/11/18
 * 描述：职业单元测试类
 */
'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/service/profession.test.js', () => {
  describe('find()', () => {
    it('初始化职业数据', async () => {
      const ctx = app.mockContext();
      // 先查询下数据量是否和配置一样
      const count = await ctx.model.Profession.estimatedDocumentCount();
      if (count === 0) {
        for (const item of app.config.professionList) {
          const profession = await ctx.service.profession.create(item);
          assert(profession);
        }
      }
    });
  });
});
