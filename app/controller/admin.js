/**
 * Create by lzan13 2020/7/6
 * 描述：管理员控制类
 */
'use strict';

const Controller = require('egg').Controller;

class AdminController extends Controller {


  // /**
  //  * 初始化服务器
  //  */
  // async init() {
  //   const { ctx, service } = this;
  //   const data = await service.admin.init();
  //   ctx.helper.success({ ctx, msg: '服务器初始化完成', data });
  // }

  /**
   * 仪表盘数据接口
   */
  async dashboard() {
    const { ctx, service } = this;
    const data = await service.admin.dashboard();
    ctx.helper.success({ ctx, msg: '数据查询完成', data });
  }

  async test() {
    let num = 880;
    num = num / 100;
    console.log(num);
    num = num.toFixed(2);
    console.log(num);
  }
}

module.exports = AdminController;
