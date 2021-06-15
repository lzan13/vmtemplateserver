/**
 * @param {Egg.Application} app - egg application
 */
'use strict';
module.exports = app => {
  const { router, controller, io } = app;

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
   */
  /**
   * View 路由
   */
  // router.get('/', controller.home.index);
  // router.get('/admin', controller.admin.index);


  /**
   * ----------------------------------------------------------
   */
  /**
   * 测试接口
   */
  router.post('/api/test/sendMail', controller.test.sendMail);

  /**
   * 管理员相关路由
   */
  router.get('/api/admin/init', controller.admin.init);


  /**
   * --------------------------------------------------
   * 登录注册路由
   */
  router.post('/api/sign/in', controller.sign.signIn);
  router.post('/api/sign/upByEmail', controller.sign.signUpByEmail);
  router.post('/api/sign/upByPhone', controller.sign.signUpByPhone);
  router.post('/api/sign/upByDevicesId', controller.sign.signUpByDevicesId);
  router.post('/api/sign/in', controller.sign.signIn);
  router.post('/api/sign/inByCode', controller.sign.signInByCode);
  router.post('/api/sign/sendVerifyEmail', controller.sign.sendVerifyEmail);
  router.post('/api/sign/sendCodeEmail', controller.sign.sendCodeEmail);
  router.get('/api/sign/activate', controller.sign.activate);
  router.get('/api/sign/out', controller.sign.signOut);


  /**
   * --------------------------------------------------
   * 用户相关路由，管理调用
   */
  // router.post('/api/user', controller.user.create);
  // router.delete('/api/user/:id', controller.user.destroy);
  // router.put('/api/user/:id', controller.user.update);
  // router.get('/api/user/:id', controller.user.show);
  // router.get('/api/user', controller.user.index);
  // RESTful 风格的 URL 定义，一个配置实现 增删改查接口，需要在对应的 Controller 内实现对应方法，具体对应看上边注释
  router.resources('user', '/api/user', controller.user);
  // 更新用户角色信息
  router.put('/api/user/:id/role', controller.user.updateRole);
  // 批量销毁，因为 RESTFul 风格 Api 没有批量删除，这里单独加一下
  router.delete('/api/user/destroyList', controller.user.destroyList);
  // 删除，这里是软删除，将用户状态改为删除
  router.put('/api/user/delete', controller.user.delete);
  // 批量删除，这里是软删除，将用户状态改为删除
  router.put('/api/user/deleteList', controller.user.deleteList);

  /**
   * --------------------------------------------------
   * 签到相关路由，管理调用
   */
  // router.post('/api/clock', controller.clock.create);
  // router.delete('/api/clock/:id', controller.clock.destroy);
  // router.get('/api/clock', controller.clock.index);
  // RESTful 风格的 URL 定义，一个配置实现 增删改查接口，需要在对应的 Controller 内实现对应方法，具体对应看上边注释
  router.resources('clock', '/api/clock', controller.clock);

  /**
   * --------------------------------------------------
   * 用户信息操作
   */
  router.put('/api/info', controller.info.updateInfo);
  router.put('/api/info/username', controller.info.updateUsername);
  router.put('/api/info/avatar', controller.info.updateAvatar);
  router.put('/api/info/cover', controller.info.updateCover);
  router.put('/api/info/password', controller.info.updatePassword);
  router.put('/api/info/personalAuth', controller.info.personalAuth);
  router.get('/api/info/current', controller.info.current);
  router.get('/api/info/other/:id', controller.info.other);
  router.post('/api/info/ids', controller.info.userList);
  router.get('/api/info/category', controller.info.category);
  router.get('/api/info/clock', controller.info.clock);
  router.get('/api/info/profession', controller.info.profession);


  /**
   * --------------------------------------------------
   * 附件相关路由
   */
  // router.post('/api/attachment', controller.attachment.create);
  // router.delete('/api/attachment/:id', controller.attachment.destroy);
  // router.put('/api/attachment/:id', controller.attachment.update)
  // router.get('/api/attachment/:id', controller.attachment.show);
  // router.get('/api/attachment', controller.attachment.index);
  // RESTful 风格的 URL 定义，一个配置实现 增删改查接口，需要在对应的 Controller 内实现对应方法，具体对应看上边注释
  router.resources('attachment', '/api/attachment', controller.attachment);
  // 通过远程 url 上传附件
  router.post('/api/attachment/url', controller.attachment.createByUrl);
  // 上传多个附件
  router.post('/api/attachments', controller.attachment.multiple);
  // 修改扩展信息
  router.put('/api/attachment/:id/extra', controller.attachment.extra);
  // 批量销毁，因为 RESTFul 风格 Api 没有批量删除，这里单独加一下
  router.delete('/api/attachment', controller.attachment.destroyList);


  /**
   * --------------------------------------------------
   * 角色相关路由
   */
  // router.post('/api/role', controller.role.create);
  // router.delete('/api/role/:id', controller.role.destroy);
  // router.put('/api/role/:id', controller.role.update);
  // router.get('/api/role/:id', controller.role.show);
  // router.get('/api/role', controller.role.index);
  // RESTful 风格的 URL 定义，一个配置实现 增删改查接口，需要在对应的 Controller 内实现对应方法，具体对应看上边注释
  router.resources('role', '/api/role', controller.role);
  // 批量删除，因为 RESTFul 风格 Api 没有批量删除，这里单独加一下
  router.delete('/api/role', controller.role.destroyList);


  /**
   * --------------------------------------------------
   * 分类相关路由
   */
  // router.post('/api/category', controller.category.create);
  // router.delete('/api/category/:id', controller.category.destroy);
  // router.put('/api/category/:id', controller.category.update)
  // router.get('/api/category/:id', controller.category.show);
  // router.get('/api/category', controller.category.index);
  // RESTful 风格的 URL 定义，一个配置实现 增删改查接口，需要在对应的 Controller 内实现对应方法，具体对应看上边注释
  router.resources('category', '/api/category', controller.category);
  // 批量销毁，因为 RESTFul 风格 Api 没有批量删除，这里单独加一下
  router.delete('/api/category', controller.category.destroyList);

  /**
   * --------------------------------------------------
   * 职业相关路由
   */
  // router.post('/api/profession', controller.profession.create);
  // router.delete('/api/profession/:id', controller.profession.destroy);
  // router.put('/api/profession/:id', controller.profession.update)
  // router.get('/api/profession/:id', controller.profession.show);
  // router.get('/api/profession', controller.profession.index);
  // RESTful 风格的 URL 定义，一个配置实现 增删改查接口，需要在对应的 Controller 内实现对应方法，具体对应看上边注释
  router.resources('profession', '/api/profession', controller.profession);
  // 批量销毁，因为 RESTFul 风格 Api 没有批量删除，这里单独加一下
  router.delete('/api/profession', controller.profession.destroyList);

  /**
   * --------------------------------------------------
   * 匹配相关路由
   */
  // router.match('/api/match', controller.match.create);
  // router.delete(
  // '/api/match/:id', controller.match.destroy);
  // router.put('/api/match/:id', controller.match.update)
  // router.get('/api/match/:id', controller.match.show);
  // router.get('/api/match', controller.match.index);
  // RESTful 风格的 URL 定义，一个配置实现 增删改查接口，需要在对应的 Controller 内实现对应方法，具体对应看上边注释
  router.resources('match', '/api/match', controller.match);
  router.get('/api/match/one', controller.match.one);

  /**
   * --------------------------------------------------
   * 内容相关路由
   */
  // router.post('/api/post', controller.post.create);
  // router.delete('/api/post/:id', controller.post.destroy);
  // router.put('/api/post/:id', controller.post.update)
  // router.get('/api/post/:id', controller.post.show);
  // router.get('/api/post', controller.post.index);
  // RESTful 风格的 URL 定义，一个配置实现 增删改查接口，需要在对应的 Controller 内实现对应方法，具体对应看上边注释
  router.resources('post', '/api/post', controller.post);
  // 批量销毁，因为 RESTFul 风格 Api 没有批量删除，这里单独加一下
  router.delete('/api/post', controller.post.destroyList);
  // 删除，这里是软删除，将用户状态改为删除
  router.put('/api/post/delete/:id', controller.post.delete);
  // 批量删除，这里是软删除，将用户状态改为删除
  router.put('/api/post/deleteList', controller.post.deleteList);

  /**
   * --------------------------------------------------
   * 房间相关路由
   */
  // router.post('/api/post', controller.post.create);
  // router.delete('/api/post/:id', controller.post.destroy);
  // router.put('/api/post/:id', controller.post.update)
  // router.get('/api/post/:id', controller.post.show);
  // router.get('/api/post', controller.post.index);
  // RESTful 风格的 URL 定义，一个配置实现 增删改查接口，需要在对应的 Controller 内实现对应方法，具体对应看上边注释
  router.resources('room', '/api/room', controller.room);
  // 批量销毁，因为 RESTFul 风格 Api 没有批量删除，这里单独加一下
  router.delete('/api/room', controller.room.destroyList);

  /**
   * --------------------------------------------------
   * 评论相关路由
   */
  // router.post('/api/comment', controller.comment.create);
  // router.delete('/api/comment/:id', controller.comment.destroy);
  // router.put('/api/comment/:id', controller.comment.update)
  // router.get('/api/comment/:id', controller.comment.show);
  // router.get('/api/comment', controller.comment.index);
  // RESTful 风格的 URL 定义，一个配置实现 增删改查接口，需要在对应的 Controller 内实现对应方法，具体对应看上边注释
  router.resources('comment', '/api/comment', controller.comment);
  // 批量销毁，因为 RESTFul 风格 Api 没有批量删除，这里单独加一下
  router.delete('/api/comment', controller.comment.destroyList);

  /**
   * --------------------------------------------------
   * 关注相关路由
   */
  router.post('/api/follow/:id', controller.follow.create);
  router.delete('/api/follow/:id', controller.follow.destroy);
  router.delete('/api/follow', controller.follow.destroyList);
  router.get('/api/follow', controller.follow.index);

  /**
   * --------------------------------------------------
   * 喜欢相关路由
   */
  router.post('/api/like', controller.like.create);
  router.delete('/api/like', controller.like.destroy);
  router.get('/api/like', controller.like.index);

  /**
   * --------------------------------------------------
   * 反馈路由
   */
  // router.post('/api/feedback', controller.comment.create);
  // router.delete('/api/feedback/:id', controller.comment.destroy);
  // router.put('/api/feedback/:id', controller.comment.update)
  // router.get('/api/feedback/:id', controller.comment.show);
  // router.get('/api/feedback', controller.comment.index);
  // RESTful 风格的 URL 定义，一个配置实现 增删改查接口，需要在对应的 Controller 内实现对应方法，具体对应看上边注释
  router.resources('feedback', '/api/feedback', controller.feedback);

};
