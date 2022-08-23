/**
 * Create by lzan13 2021/11/18
 * 描述：商品单元测试类
 */
'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/service/commodity.test.js', () => {
  describe('find()', () => {
    it('初始化虚拟商品数据', async () => {
      const ctx = app.mockContext();
      // 先查询下数据量是否和配置一样
      const count = await ctx.model.Commodity.estimatedDocumentCount();
      if (count === 0) {
        for (const item of app.config.commodityList) {
          const commodity = await ctx.service.commodity.create(item);
          assert(commodity);
        }
      }
    });
  });
});
