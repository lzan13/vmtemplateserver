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
    const { ctx } = this;

    let num = 880;
    num = num / 100;
    num = num.toFixed(2);
    console.log(num);

    /**
     * 敏感词校验
     */
    const content = '测试内容，设置一个大香蕉哈哈哈';
    const result = ctx.helper.filterSensitiveWord(ctx.common.sensitiveWordMap, content);
    console.log(content);
    console.log(result);
    ctx.helper.success({ ctx, msg: '数据处理完成', data: { src: content, target: result } });
  }
}

module.exports = AdminController;
