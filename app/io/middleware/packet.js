/**
 * Create by lzan13 2022/8/3
 * 描述：Socket.io 数据包处理中间件
 */
'use strict';
module.exports = () => {
  return async (ctx, next) => {
    console.log(`-lz-new packet: ${JSON.stringify(ctx.packet)}`);
    await next();
  };
};
