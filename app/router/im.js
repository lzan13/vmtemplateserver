/**
 * Create by lzan13 2021/1/13
 * 描述：IM 路由配置类
 */
'use strict';
module.exports = app => {
  const { controller, router, io } = app;

  // 默认为一级路由
  let apiRouter = router;
  // 检查是否启用二级站点配置
  if (app.config.subSite) {
    apiRouter = router.namespace(app.config.subSitePath);
  }

  /** 消息路由 */
  // RESTful 风格的 URL 定义，一个配置实现 增删改查接口，需要在对应的 Controller 内实现对应方法，具体对应看上边注释
  apiRouter.resources('message', '/v1/message', controller.message);
  // 批量删除，因为 RESTFul 风格 Api 没有批量删除，这里单独加一下
  apiRouter.delete('/v1/message', controller.message.destroyList);

  // 消息包路由
  io.of('/').route('message', io.controller.im.message);
  // 信令包路由
  io.of('/').route('signal', io.controller.im.signal);
  // 查询历史
  // io.of('/').route('/v1/im/get-messages', io.controller.im.getMessages);

};
