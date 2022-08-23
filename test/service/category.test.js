/**
 * Create by lzan13 2021/11/18
 * 描述：分类单元测试类
 */
'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/service/category.test.js', () => {
  describe('find()', () => {
    it('初始化帖子分类数据', async () => {
      const ctx = app.mockContext();
      // 先查询下数据量是否和配置一样
      const count = await ctx.model.Category.estimatedDocumentCount();
      if (count === 0) {
        for (const item of app.config.categoryList) {
          const category = await ctx.service.category.create(item);
          assert(category);
        }
      }
    });
  });
});
