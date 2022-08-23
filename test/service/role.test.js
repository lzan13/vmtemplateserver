/**
 * Create by lzan13 2021/11/18
 * 描述：角色单元测试类
 */
'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/service/role.test.js', () => {
  describe('find()', () => {
    it('初始化角色数据', async () => {
      const ctx = app.mockContext();
      // 先查询下数据量是否和配置一样
      const count = await ctx.model.Role.estimatedDocumentCount();
      if (count === 0) {
        for (const item of app.config.roleList) {
          const role = await ctx.service.role.create(item);
          assert(role);
        }
      }
      // 检查是否存在系统账户，不存在则创建
      for (const item of app.config.userList) {
        const user = await ctx.service.user.findByEmail(item.email);
        if (!user) {
          const role = await ctx.service.role.findByIdentity(item.identity);
          item.roleId = role.id;
          const user = await ctx.service.user.create(item);
          assert(user);
        }
      }
    });
  });
});
