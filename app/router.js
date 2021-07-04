/**
 * @param {Egg.Application} app - egg application
 */
'use strict';
module.exports = app => {
  const { router, controller } = app;

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
   * 管理员相关路由
   */
  router.get('/v1/init', controller.admin.init);

  /**
   * 配置相关路由
   */
  router.resources('config', '/v1/config', controller.config);

  /**
   * 版本相关路由
   */
  router.resources('version', '/v1/version', controller.version);


  /**
   * --------------------------------------------------
   * 登录注册路由
   */
  router.post('/v1/sign/in', controller.sign.signIn);
  router.post('/v1/sign/upByEmail', controller.sign.signUpByEmail);
  router.post('/v1/sign/upByPhone', controller.sign.signUpByPhone);
  router.post('/v1/sign/upByDevicesId', controller.sign.signUpByDevicesId);
  router.post('/v1/sign/in', controller.sign.signIn);
  router.post('/v1/sign/inByCode', controller.sign.signInByCode);
  router.post('/v1/sign/inByDevicesId', controller.sign.signInByDevicesId);
  router.get('/v1/sign/sendVerifyEmail', controller.sign.sendVerifyEmail);
  router.get('/v1/sign/sendCodeEmail', controller.sign.sendCodeEmail);
  router.get('/v1/sign/activate', controller.sign.activate);
  router.get('/v1/sign/out', controller.sign.signOut);


  /**
   * --------------------------------------------------
   * 用户相关路由，管理调用
   */
  // router.post('/v1/user', controller.user.create);
  // router.delete('/v1/user/:id', controller.user.destroy);
  // router.put('/v1/user/:id', controller.user.update);
  // router.get('/v1/user/:id', controller.user.show);
  // router.get('/v1/user', controller.user.index);
  // RESTful 风格的 URL 定义，一个配置实现 增删改查接口，需要在对应的 Controller 内实现对应方法，具体对应看上边注释
  router.resources('user', '/v1/user', controller.user);
  // 更新用户角色信息
  router.put('/v1/user/:id/role', controller.user.updateRole);
  // 批量销毁，因为 RESTFul 风格 Api 没有批量删除，这里单独加一下
  router.delete('/v1/user/destroyList', controller.user.destroyList);
  // 删除，这里是软删除，将用户状态改为删除
  router.put('/v1/user/delete', controller.user.delete);
  // 批量删除，这里是软删除，将用户状态改为删除
  router.put('/v1/user/deleteList', controller.user.deleteList);

  /**
   * --------------------------------------------------
   * 签到相关路由，管理调用
   */
  // router.post('/v1/clock', controller.clock.create);
  // router.delete('/v1/clock/:id', controller.clock.destroy);
  // router.get('/v1/clock', controller.clock.index);
  // RESTful 风格的 URL 定义，一个配置实现 增删改查接口，需要在对应的 Controller 内实现对应方法，具体对应看上边注释
  router.resources('clock', '/v1/clock', controller.clock);

  /**
   * --------------------------------------------------
   * 用户信息操作
   */
  router.put('/v1/info', controller.info.updateInfo); // 更新用户信息
  router.put('/v1/info/username', controller.info.updateUsername); // 更新用户名
  router.put('/v1/info/avatar', controller.info.updateAvatar); // 更新头像
  router.put('/v1/info/cover', controller.info.updateCover); // 更新背景
  router.put('/v1/info/bindEmail', controller.info.bindEmail); // 绑定邮箱
  router.put('/v1/info/password', controller.info.updatePassword); // 更新密码
  router.put('/v1/info/personalAuth', controller.info.personalAuth); // 认证
  router.get('/v1/info/current', controller.info.current); // 查询自己的信息
  router.get('/v1/info/other/:id', controller.info.other); // 查询指定用户信息
  router.post('/v1/info/ids', controller.info.userList); // 获取指定用户集合
  router.get('/v1/info/category', controller.info.category); // 获取分类列表
  router.get('/v1/info/clock', controller.info.clock); // 签到
  router.get('/v1/info/checkVersion', controller.info.checkVersion); // 检查版本信息
  router.get('/v1/info/profession', controller.info.profession); // 获取职业列表


  /**
   * --------------------------------------------------
   * 附件相关路由
   */
  // router.post('/v1/attachment', controller.attachment.create);
  // router.delete('/v1/attachment/:id', controller.attachment.destroy);
  // router.put('/v1/attachment/:id', controller.attachment.update)
  // router.get('/v1/attachment/:id', controller.attachment.show);
  // router.get('/v1/attachment', controller.attachment.index);
  // RESTful 风格的 URL 定义，一个配置实现 增删改查接口，需要在对应的 Controller 内实现对应方法，具体对应看上边注释
  router.resources('attachment', '/v1/attachment', controller.attachment);
  // 通过远程 url 上传附件
  router.post('/v1/attachment/url', controller.attachment.createByUrl);
  // 上传多个附件
  router.post('/v1/attachments', controller.attachment.multiple);
  // 修改扩展信息
  router.put('/v1/attachment/:id/extra', controller.attachment.extra);
  // 批量销毁，因为 RESTFul 风格 Api 没有批量删除，这里单独加一下
  router.delete('/v1/attachment', controller.attachment.destroyList);


  /**
   * --------------------------------------------------
   * 角色相关路由
   */
  // router.post('/v1/role', controller.role.create);
  // router.delete('/v1/role/:id', controller.role.destroy);
  // router.put('/v1/role/:id', controller.role.update);
  // router.get('/v1/role/:id', controller.role.show);
  // router.get('/v1/role', controller.role.index);
  // RESTful 风格的 URL 定义，一个配置实现 增删改查接口，需要在对应的 Controller 内实现对应方法，具体对应看上边注释
  router.resources('role', '/v1/role', controller.role);
  // 批量删除，因为 RESTFul 风格 Api 没有批量删除，这里单独加一下
  router.delete('/v1/role', controller.role.destroyList);


  /**
   * --------------------------------------------------
   * 分类相关路由
   */
  // router.post('/v1/category', controller.category.create);
  // router.delete('/v1/category/:id', controller.category.destroy);
  // router.put('/v1/category/:id', controller.category.update)
  // router.get('/v1/category/:id', controller.category.show);
  // router.get('/v1/category', controller.category.index);
  // RESTful 风格的 URL 定义，一个配置实现 增删改查接口，需要在对应的 Controller 内实现对应方法，具体对应看上边注释
  router.resources('category', '/v1/category', controller.category);
  // 批量销毁，因为 RESTFul 风格 Api 没有批量删除，这里单独加一下
  router.delete('/v1/category', controller.category.destroyList);

  /**
   * --------------------------------------------------
   * 职业相关路由
   */
  // router.post('/v1/profession', controller.profession.create);
  // router.delete('/v1/profession/:id', controller.profession.destroy);
  // router.put('/v1/profession/:id', controller.profession.update)
  // router.get('/v1/profession/:id', controller.profession.show);
  // router.get('/v1/profession', controller.profession.index);
  // RESTful 风格的 URL 定义，一个配置实现 增删改查接口，需要在对应的 Controller 内实现对应方法，具体对应看上边注释
  router.resources('profession', '/v1/profession', controller.profession);
  // 批量销毁，因为 RESTFul 风格 Api 没有批量删除，这里单独加一下
  router.delete('/v1/profession', controller.profession.destroyList);

  /**
   * --------------------------------------------------
   * 匹配相关路由
   */
  // router.match('/v1/match', controller.match.create);
  // router.delete(
  // '/v1/match/:id', controller.match.destroy);
  // router.put('/v1/match/:id', controller.match.update)
  // router.get('/v1/match/:id', controller.match.show);
  // router.get('/v1/match', controller.match.index);
  // RESTful 风格的 URL 定义，一个配置实现 增删改查接口，需要在对应的 Controller 内实现对应方法，具体对应看上边注释
  router.resources('match', '/v1/match', controller.match);
  router.get('/v1/match/one', controller.match.one);

  /**
   * --------------------------------------------------
   * 内容相关路由
   */
  // router.post('/v1/post', controller.post.create);
  // router.delete('/v1/post/:id', controller.post.destroy);
  // router.put('/v1/post/:id', controller.post.update)
  // router.get('/v1/post/:id', controller.post.show);
  // router.get('/v1/post', controller.post.index);
  // RESTful 风格的 URL 定义，一个配置实现 增删改查接口，需要在对应的 Controller 内实现对应方法，具体对应看上边注释
  router.resources('post', '/v1/post', controller.post);
  // 批量销毁，因为 RESTFul 风格 Api 没有批量删除，这里单独加一下
  router.delete('/v1/post', controller.post.destroyList);
  // 删除，这里是软删除，将用户状态改为删除
  router.put('/v1/post/delete/:id', controller.post.delete);
  // 批量删除，这里是软删除，将用户状态改为删除
  router.put('/v1/post/deleteList', controller.post.deleteList);

  /**
   * --------------------------------------------------
   * 房间相关路由
   */
  // router.post('/v1/post', controller.post.create);
  // router.delete('/v1/post/:id', controller.post.destroy);
  // router.put('/v1/post/:id', controller.post.update)
  // router.get('/v1/post/:id', controller.post.show);
  // router.get('/v1/post', controller.post.index);
  // RESTful 风格的 URL 定义，一个配置实现 增删改查接口，需要在对应的 Controller 内实现对应方法，具体对应看上边注释
  router.resources('room', '/v1/room', controller.room);
  // 批量销毁，因为 RESTFul 风格 Api 没有批量删除，这里单独加一下
  router.delete('/v1/room', controller.room.destroyList);

  /**
   * --------------------------------------------------
   * 评论相关路由
   */
  // router.post('/v1/comment', controller.comment.create);
  // router.delete('/v1/comment/:id', controller.comment.destroy);
  // router.put('/v1/comment/:id', controller.comment.update)
  // router.get('/v1/comment/:id', controller.comment.show);
  // router.get('/v1/comment', controller.comment.index);
  // RESTful 风格的 URL 定义，一个配置实现 增删改查接口，需要在对应的 Controller 内实现对应方法，具体对应看上边注释
  router.resources('comment', '/v1/comment', controller.comment);
  // 批量销毁，因为 RESTFul 风格 Api 没有批量删除，这里单独加一下
  router.delete('/v1/comment', controller.comment.destroyList);

  /**
   * --------------------------------------------------
   * 关注相关路由
   */
  router.post('/v1/follow/:id', controller.follow.create);
  router.delete('/v1/follow/:id', controller.follow.destroy);
  router.delete('/v1/follow', controller.follow.destroyList);
  router.get('/v1/follow', controller.follow.index);

  /**
   * --------------------------------------------------
   * 喜欢相关路由
   */
  router.post('/v1/like', controller.like.create);
  router.delete('/v1/like', controller.like.destroy);
  router.get('/v1/like', controller.like.index);

  /**
   * --------------------------------------------------
   * 反馈路由
   */
  // router.post('/v1/feedback', controller.comment.create);
  // router.delete('/v1/feedback/:id', controller.comment.destroy);
  // router.put('/v1/feedback/:id', controller.comment.update)
  // router.get('/v1/feedback/:id', controller.comment.show);
  // router.get('/v1/feedback', controller.comment.index);
  // RESTful 风格的 URL 定义，一个配置实现 增删改查接口，需要在对应的 Controller 内实现对应方法，具体对应看上边注释
  router.resources('feedback', '/v1/feedback', controller.feedback);

};
