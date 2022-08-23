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

  /** 用户信息操作 */
  apiRouter.put('/v1/info', controller.info.updateInfo); // 更新用户信息
  apiRouter.put('/v1/info/username', controller.info.updateUsername); // 更新用户名
  apiRouter.put('/v1/info/avatar', controller.info.updateAvatar); // 更新头像
  apiRouter.put('/v1/info/cover', controller.info.updateCover); // 更新封面
  apiRouter.put('/v1/info/bindEmail', controller.info.bindEmail); // 绑定邮箱
  apiRouter.put('/v1/info/password', controller.info.updatePassword); // 更新密码
  apiRouter.put('/v1/info/realAuth', controller.info.realAuth); // 认证
  apiRouter.get('/v1/info/current', controller.info.current); // 查询自己的信息
  apiRouter.get('/v1/info/other/:id', controller.info.other); // 查询指定用户信息
  apiRouter.post('/v1/info/ids', controller.info.userList); // 获取指定用户集合
  apiRouter.get('/v1/info/clock', controller.info.clock); // 签到

};
