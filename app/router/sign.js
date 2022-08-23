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

  /** 登录注册路由 */
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

};
