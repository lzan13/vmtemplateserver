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

  /** 公共接口 */
  apiRouter.get('/v1/common/appConfig', controller.common.appConfig); // 获取客户端配置
  apiRouter.get('/v1/common/appletList', controller.common.appletList); // 获取程序列表
  apiRouter.get('/v1/common/category', controller.common.category); // 获取分类列表
  apiRouter.get('/v1/common/checkVersion', controller.common.checkVersion); // 检查版本信息
  apiRouter.post('/v1/common/feedback', controller.common.feedback); // 提交反馈
  apiRouter.get('/v1/common/feedbackList', controller.common.feedbackList); // 查询我提交的反馈
  apiRouter.get('/v1/common/profession', controller.common.profession); // 获取职业列表
  apiRouter.get('/v1/common/privatePolicy', controller.common.privatePolicy); // 隐私政策
  apiRouter.get('/v1/common/userAgreement', controller.common.userAgreement); // 用户协议
  apiRouter.get('/v1/common/userNorm', controller.common.userNorm); // 用户行为规范
  apiRouter.get('/v1/common/virtualCommodityList', controller.common.virtualCommodityList); // 获取虚拟商品列表

  /** 广告相关路由 */
  /** 视频奖励 */
  apiRouter.post('/v1/common/ads/videoReward', controller.ads.videoReward);

  /** 支付相关接口，这个需要在支付平台配置 */
  apiRouter.post('/v1/common/pay/notifyCallback', controller.third.pay.notifyCallback); // 支付通知网关
  apiRouter.post('/v1/common/pay/authCallback', controller.third.pay.authCallback); // 授权回调接口

};
