/**
 * Create by lzan13 2021/1/13
 * 描述：路由配置类
 */
'use strict';
module.exports = app => {
  const { router, controller } = app;

  // 默认为一级路由
  let apiRouter = router;

  // 检查是否启用二级站点配置
  if (app.config.subSite) {
    apiRouter = app.router.namespace(app.config.subSitePath);
  }

  /**
   * RESTful 风格接口与方法对应关系
   */
  // Method	  Path Simple       Route Name	Controller.Action
  // GET	    /posts	          posts	      app.controller.posts.index
  // GET	    /posts/new	      new_post	  app.controller.posts.new
  // GET	    /posts/:id	      post	      app.controller.posts.show
  // GET	    /posts/:id/edit	  edit_post	  app.controller.posts.edit
  // POST	    /posts	          posts	      app.controller.posts.create
  // PUT	    /posts/:id	      post	      app.controller.posts.update
  // DELETE	  /posts/:id	      post	      app.controller.posts.destroy

  /**
   * ----------------------------------------------------------
   * 统计相关路由
   */
  // apiRouter.get('/v1/admin/init', controller.admin.init);
  apiRouter.get('/v1/admin/dashboard', controller.admin.dashboard);

  /**
   * ----------------------------------------------------------
   * 附件相关路由
   */
  // apiRouter.post('/v1/attachment', controller.attachment.create);
  // apiRouter.delete('/v1/attachment/:id', controller.attachment.destroy);
  // apiRouter.put('/v1/attachment/:id', controller.attachment.update)
  // apiRouter.get('/v1/attachment/:id', controller.attachment.show);
  // apiRouter.get('/v1/attachment', controller.attachment.index);
  // RESTful 风格的 URL 定义，一个配置实现 增删改查接口，需要在对应的 Controller 内实现对应方法，具体对应看上边注释
  apiRouter.resources('attachment', '/v1/attachment', controller.attachment);
  // 批量销毁，因为 RESTFul 风格 Api 没有批量删除，这里单独加一下
  apiRouter.delete('/v1/attachment', controller.attachment.destroyList);

  /**
   * ----------------------------------------------------------
   * 分类相关路由
   */
  // apiRouter.post('/v1/category', controller.category.create);
  // apiRouter.delete('/v1/category/:id', controller.category.destroy);
  // apiRouter.put('/v1/category/:id', controller.category.update)
  // apiRouter.get('/v1/category/:id', controller.category.show);
  // apiRouter.get('/v1/category', controller.category.index);
  // RESTful 风格的 URL 定义，一个配置实现 增删改查接口，需要在对应的 Controller 内实现对应方法，具体对应看上边注释
  apiRouter.resources('category', '/v1/category', controller.category);
  // 批量销毁，因为 RESTFul 风格 Api 没有批量删除，这里单独加一下
  apiRouter.delete('/v1/category', controller.category.destroyList);

  /**
   * ----------------------------------------------------------
   * 签到相关路由，管理调用
   */
  // apiRouter.post('/v1/clock', controller.clock.create);
  // apiRouter.delete('/v1/clock/:id', controller.clock.destroy);
  // apiRouter.get('/v1/clock', controller.clock.index);
  // RESTful 风格的 URL 定义，一个配置实现 增删改查接口，需要在对应的 Controller 内实现对应方法，具体对应看上边注释
  apiRouter.resources('clock', '/v1/clock', controller.clock);

  /**
   * ----------------------------------------------------------
   * 验证码相关路由，管理调用
   */
  apiRouter.resources('code', '/v1/code', controller.code);

  /**
   * ----------------------------------------------------------
   * 评论相关路由
   */
  // apiRouter.post('/v1/comment', controller.comment.create);
  // apiRouter.delete('/v1/comment/:id', controller.comment.destroy);
  // apiRouter.put('/v1/comment/:id', controller.comment.update)
  // apiRouter.get('/v1/comment/:id', controller.comment.show);
  // apiRouter.get('/v1/comment', controller.comment.index);
  // RESTful 风格的 URL 定义，一个配置实现 增删改查接口，需要在对应的 Controller 内实现对应方法，具体对应看上边注释
  apiRouter.resources('comment', '/v1/comment', controller.comment);
  // 批量销毁，因为 RESTFul 风格 Api 没有批量删除，这里单独加一下
  apiRouter.delete('/v1/comment', controller.comment.destroyList);

  /**
   * ----------------------------------------------------------
   * 商品相关路由
   */
  apiRouter.resources('commodity', '/v1/commodity', controller.commodity);

  /**
   * ----------------------------------------------------------
   * 公共接口
   */
  apiRouter.get('/v1/common/category', controller.common.category); // 获取分类列表
  apiRouter.get('/v1/common/profession', controller.common.profession); // 获取职业列表
  apiRouter.get('/v1/common/checkVersion', controller.common.checkVersion); // 检查版本信息
  apiRouter.get('/v1/common/clientConfig', controller.common.clientConfig); // 获取客户端配置
  apiRouter.get('/v1/common/privatePolicy', controller.common.privatePolicy); // 隐私政策
  apiRouter.get('/v1/common/userAgreement', controller.common.userAgreement); // 用户协议
  apiRouter.post('/v1/common/feedback', controller.common.feedback); // 提交反馈
  apiRouter.get('/v1/common/feedbackList', controller.common.feedbackList); // 查询我提交的反馈
  apiRouter.get('/v1/common/commodityList', controller.common.commodityList); // 获取商品列表

  /**
   * ----------------------------------------------------------
   * 配置相关路由
   */
  apiRouter.resources('config', '/v1/config', controller.config);

  /**
   * ----------------------------------------------------------
   * 反馈路由
   */
  // apiRouter.post('/v1/feedback', controller.comment.create);
  // apiRouter.delete('/v1/feedback/:id', controller.comment.destroy);
  // apiRouter.put('/v1/feedback/:id', controller.comment.update)
  // apiRouter.get('/v1/feedback/:id', controller.comment.show);
  // apiRouter.get('/v1/feedback', controller.comment.index);
  // RESTful 风格的 URL 定义，一个配置实现 增删改查接口，需要在对应的 Controller 内实现对应方法，具体对应看上边注释
  apiRouter.resources('feedback', '/v1/feedback', controller.feedback);

  /**
   * ----------------------------------------------------------
   * 关注相关路由
   */
  // apiRouter.post('/v1/follow/:id', controller.follow.create);
  // apiRouter.delete('/v1/follow/:id', controller.follow.destroy);
  // apiRouter.get('/v1/follow', controller.follow.index);
  apiRouter.resources('follow', '/v1/follow', controller.follow);
  apiRouter.delete('/v1/follow', controller.follow.destroyList);
  apiRouter.post('/v1/follow/cancel', controller.follow.cancelFollow);

  /**
   * ----------------------------------------------------------
   * 三方服务接口
   */
  // 支付相关接口
  // 支付通知网关
  apiRouter.post('/v1/third/pay/gateway', controller.third.pay.gateway);
  // 授权回调接口
  apiRouter.post('/v1/third/pay/authCallback', controller.third.pay.authCallback);

  /**
   * ----------------------------------------------------------
   * 用户信息操作
   */
  apiRouter.put('/v1/info', controller.info.updateInfo); // 更新用户信息
  apiRouter.put('/v1/info/username', controller.info.updateUsername); // 更新用户名
  apiRouter.put('/v1/info/avatar', controller.info.updateAvatar); // 更新头像
  apiRouter.put('/v1/info/cover', controller.info.updateCover); // 更新封面
  apiRouter.put('/v1/info/bindEmail', controller.info.bindEmail); // 绑定邮箱
  apiRouter.put('/v1/info/password', controller.info.updatePassword); // 更新密码
  apiRouter.put('/v1/info/personalAuth', controller.info.personalAuth); // 认证
  apiRouter.get('/v1/info/current', controller.info.current); // 查询自己的信息
  apiRouter.get('/v1/info/other/:id', controller.info.other); // 查询指定用户信息
  apiRouter.post('/v1/info/ids', controller.info.userList); // 获取指定用户集合
  apiRouter.get('/v1/info/clock', controller.info.clock); // 签到

  /**
   * ----------------------------------------------------------
   * 喜欢相关路由
   */
  // apiRouter.post('/v1/like', controller.like.create);
  // apiRouter.delete('/v1/like', controller.like.destroy);
  // apiRouter.get('/v1/like', controller.like.index);
  apiRouter.resources('like', '/v1/like', controller.like);
  apiRouter.post('/v1/like/cancel', controller.like.cancelLike);

  /**
   * ----------------------------------------------------------
   * 匹配相关路由
   */
  // apiRouter.match('/v1/match', controller.match.create);
  // apiRouter.delete(
  // '/v1/match/:id', controller.match.destroy);
  // apiRouter.put('/v1/match/:id', controller.match.update)
  // apiRouter.get('/v1/match/:id', controller.match.show);
  // apiRouter.get('/v1/match', controller.match.index);
  // RESTful 风格的 URL 定义，一个配置实现 增删改查接口，需要在对应的 Controller 内实现对应方法，具体对应看上边注释
  apiRouter.resources('match', '/v1/match', controller.match);
  apiRouter.get('/v1/match/random', controller.match.random);

  /**
   * ----------------------------------------------------------
   * 订单相关路由
   */
  apiRouter.resources('order', '/v1/order', controller.order);
  // 批量销毁，因为 RESTFul 风格 Api 没有批量删除，这里单独加一下
  apiRouter.delete('/v1/order/destroyList', controller.order.destroyList);

  /**
   * ----------------------------------------------------------
   * 内容相关路由
   */
  // apiRouter.post('/v1/post', controller.post.create);
  // apiRouter.delete('/v1/post/:id', controller.post.destroy);
  // apiRouter.put('/v1/post/:id', controller.post.update)
  // apiRouter.get('/v1/post/:id', controller.post.show);
  // apiRouter.get('/v1/post', controller.post.index);
  // RESTful 风格的 URL 定义，一个配置实现 增删改查接口，需要在对应的 Controller 内实现对应方法，具体对应看上边注释
  apiRouter.resources('post', '/v1/post', controller.post);
  // 批量销毁，因为 RESTFul 风格 Api 没有批量删除，这里单独加一下
  apiRouter.delete('/v1/post', controller.post.destroyList);
  // 删除，这里是软删除，将用户状态改为删除
  apiRouter.put('/v1/post/delete/:id', controller.post.delete);
  // 批量删除，这里是软删除，将用户状态改为删除
  apiRouter.put('/v1/post/deleteList', controller.post.deleteList);

  /**
   * ----------------------------------------------------------
   * 职业相关路由
   */
  // apiRouter.post('/v1/profession', controller.profession.create);
  // apiRouter.delete('/v1/profession/:id', controller.profession.destroy);
  // apiRouter.put('/v1/profession/:id', controller.profession.update)
  // apiRouter.get('/v1/profession/:id', controller.profession.show);
  // apiRouter.get('/v1/profession', controller.profession.index);
  // RESTful 风格的 URL 定义，一个配置实现 增删改查接口，需要在对应的 Controller 内实现对应方法，具体对应看上边注释
  apiRouter.resources('profession', '/v1/profession', controller.profession);
  // 批量销毁，因为 RESTFul 风格 Api 没有批量删除，这里单独加一下
  apiRouter.delete('/v1/profession', controller.profession.destroyList);

  /**
   * ----------------------------------------------------------
   * 角色相关路由
   */
  // apiRouter.post('/v1/role', controller.role.create);
  // apiRouter.delete('/v1/role/:id', controller.role.destroy);
  // apiRouter.put('/v1/role/:id', controller.role.update);
  // apiRouter.get('/v1/role/:id', controller.role.show);
  // apiRouter.get('/v1/role', controller.role.index);
  // RESTful 风格的 URL 定义，一个配置实现 增删改查接口，需要在对应的 Controller 内实现对应方法，具体对应看上边注释
  apiRouter.resources('role', '/v1/role', controller.role);
  // 批量删除，因为 RESTFul 风格 Api 没有批量删除，这里单独加一下
  apiRouter.delete('/v1/role', controller.role.destroyList);

  /**
   * ----------------------------------------------------------
   * 房间相关路由
   */
  // apiRouter.post('/v1/post', controller.post.create);
  // apiRouter.delete('/v1/post/:id', controller.post.destroy);
  // apiRouter.put('/v1/post/:id', controller.post.update)
  // apiRouter.get('/v1/post/:id', controller.post.show);
  // apiRouter.get('/v1/post', controller.post.index);
  // RESTful 风格的 URL 定义，一个配置实现 增删改查接口，需要在对应的 Controller 内实现对应方法，具体对应看上边注释
  apiRouter.resources('room', '/v1/room', controller.room);
  // 批量销毁，因为 RESTFul 风格 Api 没有批量删除，这里单独加一下
  apiRouter.delete('/v1/room', controller.room.destroyList);

  /**
   * ----------------------------------------------------------
   * 登录注册路由
   */
  apiRouter.post('/v1/sign/upByEmail', controller.sign.signUpByEmail);
  apiRouter.post('/v1/sign/upByPhone', controller.sign.signUpByPhone);
  apiRouter.post('/v1/sign/upByDevicesId', controller.sign.signUpByDevicesId);
  apiRouter.post('/v1/sign/in', controller.sign.signIn);
  apiRouter.post('/v1/sign/inByCode', controller.sign.signInByCode);
  apiRouter.post('/v1/sign/inByDevicesId', controller.sign.signInByDevicesId);
  apiRouter.get('/v1/sign/out', controller.sign.signOut);
  apiRouter.get('/v1/sign/destroy', controller.sign.destroy);
  apiRouter.get('/v1/sign/activate', controller.sign.activate);
  apiRouter.get('/v1/sign/sendCodeEmail', controller.sign.sendCodeEmail);
  apiRouter.get('/v1/sign/sendVerifyEmail', controller.sign.sendVerifyEmail);

  /**
   * ----------------------------------------------------------
   * 用户相关路由，管理调用
   */
  // apiRouter.post('/v1/user', controller.user.create);
  // apiRouter.delete('/v1/user/:id', controller.user.destroy);
  // apiRouter.put('/v1/user/:id', controller.user.update);
  // apiRouter.get('/v1/user/:id', controller.user.show);
  // apiRouter.get('/v1/user', controller.user.index);
  // RESTful 风格的 URL 定义，一个配置实现 增删改查接口，需要在对应的 Controller 内实现对应方法，具体对应看上边注释
  apiRouter.resources('user', '/v1/user', controller.user);
  // 更新用户角色信息
  apiRouter.put('/v1/user/:id/role', controller.user.updateRole);
  // 批量销毁，因为 RESTFul 风格 Api 没有批量删除，这里单独加一下
  apiRouter.delete('/v1/user/destroyList', controller.user.destroyList);
  // 删除，这里是软删除，将用户状态改为删除
  apiRouter.put('/v1/user/delete', controller.user.delete);
  // 批量删除，这里是软删除，将用户状态改为删除
  apiRouter.put('/v1/user/deleteList', controller.user.deleteList);

  /**
   * ----------------------------------------------------------
   * 版本相关路由
   */
  apiRouter.resources('version', '/v1/version', controller.version);

};
