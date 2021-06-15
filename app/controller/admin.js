/**
 * Create by lzan13 2020/7/6
 * 描述：管理员控制类
 */
'use strict';

const Controller = require('egg').Controller;

class AdminController extends Controller {

  /**
   * 管理员主页
   */
  async index() {
    const { ctx, service } = this;
    const config = await service.config.findByAlias('default');
    if (!config) {
      ctx.throw(404, '服务器未初始化，请联系管理员操作');
    }
    ctx.body = '这里是管理员界面';
  }

  /**
   * 初始化服务器
   */
  async init() {
    const { app, ctx, service } = this;
    let config = await service.config.findByAlias('default');
    if (config) {
      ctx.helper.success({ ctx, msg: '服务器已初始化', data: config });
      return;
    }
    // 组装参数
    let params = {
      alias: 'default',
      title: app.config.title,
      desc: app.config.desc,
      open: true,
    };
    // 1 创建配置
    config = await service.config.create(params);
    if (config) {
      app.logger.debug('║ 创建配置 - 成功');
    } else {
      app.logger.debug('║ 创建配置 - 失败');
    }
    // 2 创建角色信息
    let superRole;
    for (const item of app.config.roleList) {
      const role = await service.role.create(item);
      if (role) {
        if (role.identity === 999) {
          superRole = role;
        }
        app.logger.debug(`║ 创建角色 ${role.name} - 成功`);
      } else {
        app.logger.debug(`║ 创建角色 ${role.name} - 失败`);
      }
    }

    // 3 创建分类
    for (const item of app.config.categoryList) {
      const category = await service.category.create(item);
      if (category) {
        app.logger.debug(`║ 创建分类 ${category.name} - 成功`);
      } else {
        app.logger.debug(`║ 创建分类 ${category.name} - 失败`);
      }
    }

    // 4 创建职业
    for (const item of app.config.professionList) {
      const profession = await service.profession.create(item);
      if (profession) {
        app.logger.debug(`║ 创建职业 ${profession.name} - 成功`);
      } else {
        app.logger.debug(`║ 创建职业 ${profession.name} - 失败`);
      }
    }

    // 5 创建超管账户
    params = { username: app.config.username, email: app.config.email, password: app.config.password, roleId: superRole.id };
    const user = await service.user.create(params);
    if (user) {
      app.logger.debug('║ 创建超管账户 - 成功');
    } else {
      app.logger.error('║ 创建超管账户 - 失败');
    }

    ctx.helper.success({ ctx, msg: '服务器初始化完成', data: { config, user } });
  }

}

module.exports = AdminController;
