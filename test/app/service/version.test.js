/**
 * Create by lzan13 2021/11/18
 * 描述：版本单元测试类
 */
'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/service/version.test.js', () => {
  describe('find()', () => {
    it('初始化版本数据', async () => {
      const ctx = app.mockContext();
      // 先查询下数据量是否和配置一样
      const count = await ctx.model.Version.estimatedDocumentCount();
      if (count === 0) {
        for (const item of app.config.versionList) {
          const role = await ctx.service.version.create(item);
          assert(role);
        }
      }
    });
  });
});
