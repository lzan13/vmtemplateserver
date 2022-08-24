/**
 * Create by lzan13 2022/8/3
 * 描述：Socket.io 链接处理中间件
 */
'use strict';
module.exports = () => {
  return async (ctx, next) => {

    await ctx.service.ws.im.connect();

    await next();

    await ctx.service.ws.im.disconnect();
  };
};
