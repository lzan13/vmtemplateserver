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
        let superRole;
        for (const item of app.config.roleList) {
          const role = await ctx.service.role.create(item);
          assert(role);
          if (role.identity === 1000) {
            superRole = role;
          }
        }

        // 检查是否存在超管账户，不存在则创建
        let user = await ctx.service.user.findByEmail(app.config.super.email);
        if (!user) {
          const params = app.config.super;
          params.roleId = superRole.id;
          user = await ctx.service.user.create(params);
          assert(user);
        }
      }
    });
  });
});
