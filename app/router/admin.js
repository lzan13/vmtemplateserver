/**
 * Create by lzan13 2021/1/13
 * 描述：路由配置类
 */
'use strict';
module.exports = app => {

  const { controller, router } = app;

  // 默认为一级路由
  let apiRouter = router;

  // 检查是否启用二级站点配置
  if (app.config.subSite) {
    apiRouter = router.namespace(app.config.subSitePath);
  }

  /** 统计相关路由 */
  apiRouter.get('/v1/admin/dashboard', controller.admin.dashboard);

  apiRouter.get('/v1/test', controller.admin.test);

  /** 程序相关路由 */
  // RESTful 风格的 URL 定义，一个配置实现 增删改查接口，需要在对应的 Controller 内实现对应方法，具体对应看上边注释
  apiRouter.resources('applet', '/v1/applet', controller.applet);
  // 批量删除，因为 RESTFul 风格 Api 没有批量删除，这里单独加一下
  apiRouter.delete('/v1/applet', controller.applet.destroyList);

  /** 附件相关路由 */
  // RESTful 风格的 URL 定义，一个配置实现 增删改查接口，需要在对应的 Controller 内实现对应方法，具体对应看上边注释
  apiRouter.resources('attachment', '/v1/attachment', controller.attachment);
  // 批量删除，因为 RESTFul 风格 Api 没有批量删除，这里单独加一下
  apiRouter.delete('/v1/attachment', controller.attachment.destroyList);

  /** 黑名单相关路由 */
  apiRouter.resources('blacklist', '/v1/blacklist', controller.blacklist);
  apiRouter.delete('/v1/blacklist', controller.blacklist.destroyList);
  apiRouter.post('/v1/blacklist/cancel', controller.blacklist.cancel);

  /** 分类相关路由 */
  // RESTful 风格的 URL 定义，一个配置实现 增删改查接口，需要在对应的 Controller 内实现对应方法，具体对应看上边注释
  apiRouter.resources('category', '/v1/category', controller.category);
  // 批量删除，因为 RESTFul 风格 Api 没有批量删除，这里单独加一下
  apiRouter.delete('/v1/category', controller.category.destroyList);

  /** 签到相关路由，管理调用 */
  // RESTful 风格的 URL 定义，一个配置实现 增删改查接口，需要在对应的 Controller 内实现对应方法，具体对应看上边注释
  apiRouter.resources('clock', '/v1/clock', controller.clock);
  // 批量删除，因为 RESTFul 风格 Api 没有批量删除，这里单独加一下
  apiRouter.delete('/v1/clock', controller.clock.destroyList);

  /** 验证码相关路由，管理调用 */
  apiRouter.resources('code', '/v1/code', controller.code);
  // 批量删除，因为 RESTFul 风格 Api 没有批量删除，这里单独加一下
  apiRouter.delete('/v1/code', controller.code.destroyList);

  /** 评论相关路由 */
  // RESTful 风格的 URL 定义，一个配置实现 增删改查接口，需要在对应的 Controller 内实现对应方法，具体对应看上边注释
  apiRouter.resources('comment', '/v1/comment', controller.comment);
  // 批量删除，因为 RESTFul 风格 Api 没有批量删除，这里单独加一下
  apiRouter.delete('/v1/comment', controller.comment.destroyList);

  /** 商品相关路由 */
  apiRouter.resources('commodity', '/v1/commodity', controller.commodity);
  // 批量删除，因为 RESTFul 风格 Api 没有批量删除，这里单独加一下
  apiRouter.delete('/v1/commodity', controller.commodity.destroyList);

  /** 配置相关路由 */
  apiRouter.resources('config', '/v1/config', controller.config);
  // 批量删除，因为 RESTFul 风格 Api 没有批量删除，这里单独加一下
  apiRouter.delete('/v1/config', controller.config.destroyList);

  /** 反馈路由 */
  // RESTful 风格的 URL 定义，一个配置实现 增删改查接口，需要在对应的 Controller 内实现对应方法，具体对应看上边注释
  apiRouter.resources('feedback', '/v1/feedback', controller.feedback);
  // 批量删除，因为 RESTFul 风格 Api 没有批量删除，这里单独加一下
  apiRouter.delete('/v1/feedback', controller.feedback.destroyList);

  /** 礼物相关路由 */
  apiRouter.resources('gift', '/v1/gift', controller.gift);
  // 赠送礼物
  apiRouter.post('/v1/gift/give', controller.gift.give);
  // 批量删除，因为 RESTFul 风格 Api 没有批量删除，这里单独加一下
  apiRouter.delete('/v1/gift', controller.gift.destroyList);

  /** 礼物记录相关路由 */
  apiRouter.resources('giftRelation', '/v1/giftRelation', controller.giftRelation);
  // 批量删除，因为 RESTFul 风格 Api 没有批量删除，这里单独加一下
  apiRouter.delete('/v1/giftRelation', controller.giftRelation.destroyList);

  /** 喜欢相关路由 */
  apiRouter.resources('like', '/v1/like', controller.like);
  apiRouter.post('/v1/like/cancel', controller.like.cancelLike);
  // 批量删除，因为 RESTFul 风格 Api 没有批量删除，这里单独加一下
  apiRouter.delete('/v1/like', controller.like.destroyList);

  /** 匹配相关路由 */
  // RESTful 风格的 URL 定义，一个配置实现 增删改查接口，需要在对应的 Controller 内实现对应方法，具体对应看上边注释
  apiRouter.resources('match', '/v1/match', controller.match);
  // 随机匹配
  apiRouter.get('/v1/match/random', controller.match.random);
  // 批量删除，因为 RESTFul 风格 Api 没有批量删除，这里单独加一下
  apiRouter.delete('/v1/match', controller.match.destroyList);

  /** 订单相关路由 */
  apiRouter.resources('order', '/v1/order', controller.order);
  // 批量删除，因为 RESTFul 风格 Api 没有批量删除，这里单独加一下
  apiRouter.delete('/v1/order', controller.order.destroyList);
  // 获取订单支付信息
  apiRouter.get('/v1/order/payInfo/:id', controller.order.payInfo);

  /** 内容相关路由 */
  // RESTful 风格的 URL 定义，一个配置实现 增删改查接口，需要在对应的 Controller 内实现对应方法，具体对应看上边注释
  apiRouter.resources('post', '/v1/post', controller.post);
  // 批量删除，因为 RESTFul 风格 Api 没有批量删除，这里单独加一下
  apiRouter.delete('/v1/post', controller.post.destroyList);
  // 删除，这里是软删除，将用户状态改为删除
  apiRouter.put('/v1/post/delete/:id', controller.post.delete);
  // 批量删除，这里是软删除，将用户状态改为删除
  apiRouter.put('/v1/post/deleteList', controller.post.deleteList);

  /** 职业相关路由 */
  // RESTful 风格的 URL 定义，一个配置实现 增删改查接口，需要在对应的 Controller 内实现对应方法，具体对应看上边注释
  apiRouter.resources('profession', '/v1/profession', controller.profession);
  // 批量删除，因为 RESTFul 风格 Api 没有批量删除，这里单独加一下
  apiRouter.delete('/v1/profession', controller.profession.destroyList);

  /** 用户关系相关路由 */
  apiRouter.resources('relation', '/v1/relation', controller.relation);
  // 批量删除，因为 RESTFul 风格 Api 没有批量删除，这里单独加一下
  apiRouter.delete('/v1/relation', controller.relation.destroyList);
  // 取消关注
  apiRouter.post('/v1/relation/cancelFollow', controller.relation.cancelFollow);

  /** 角色相关路由 */
  // RESTful 风格的 URL 定义，一个配置实现 增删改查接口，需要在对应的 Controller 内实现对应方法，具体对应看上边注释
  apiRouter.resources('role', '/v1/role', controller.role);
  // 批量删除，因为 RESTFul 风格 Api 没有批量删除，这里单独加一下
  apiRouter.delete('/v1/role', controller.role.destroyList);

  /** 房间相关路由 */
  // RESTful 风格的 URL 定义，一个配置实现 增删改查接口，需要在对应的 Controller 内实现对应方法，具体对应看上边注释
  apiRouter.resources('room', '/v1/room', controller.room);
  // 批量删除，因为 RESTFul 风格 Api 没有批量删除，这里单独加一下
  apiRouter.delete('/v1/room', controller.room.destroyList);

  /** 积分变动记录相关路由 */
  // RESTful 风格的 URL 定义，一个配置实现 增删改查接口，需要在对应的 Controller 内实现对应方法，具体对应看上边注释
  apiRouter.resources('score', '/v1/score', controller.score);
  // 批量删除，因为 RESTFul 风格 Api 没有批量删除，这里单独加一下
  apiRouter.delete('/v1/score', controller.score.destroyList);

  /** 用户相关路由，管理调用 */
  // RESTful 风格的 URL 定义，一个配置实现 增删改查接口，需要在对应的 Controller 内实现对应方法，具体对应看上边注释
  apiRouter.resources('user', '/v1/user', controller.user);
  // 更新用户角色信息
  apiRouter.put('/v1/user/:id/role', controller.user.updateRole);
  // 批量删除，因为 RESTFul 风格 Api 没有批量删除，这里单独加一下
  apiRouter.delete('/v1/user', controller.user.destroyList);
  // 删除，这里是软删除，将用户状态改为删除
  apiRouter.put('/v1/user/delete', controller.user.delete);
  // 批量删除，这里是软删除，将用户状态改为删除
  apiRouter.put('/v1/user/deleteList', controller.user.deleteList);

  /** 版本相关路由 */
  apiRouter.resources('version', '/v1/version', controller.version);
  // 批量删除，因为 RESTFul 风格 Api 没有批量删除，这里单独加一下
  apiRouter.delete('/v1/version', controller.version.destroyList);

};
