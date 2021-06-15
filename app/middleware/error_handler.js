/**
 * Create by lzan13 2020/7/7
 * 描述：全局错误处理中间件
 */
'use strict';
module.exports = (option, app) => {
  return async function(ctx, next) {
    try {
      await next();
    } catch (err) {
      // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志
      app.emit('error', err, this);
      const status = err.status || 500;
      // 生产环境时 500 错误的详细错误内容不返回给客户端，因为可能包含敏感信息
      let error = status === 500 && app.config.env === 'prod' ? '服务器错误' : err.message;

      // 处理错误信息
      // if (status === 401) {
      //   ctx.body.msg = '需要身份认证';
      // }
      // if (status === 403) {
      //   ctx.body.msg = '无权操作';
      //   ctx.body.detail = err.errors;
      // }
      if (status === 422) {
        error = '参数错误';
        // ctx.body.msg = '参数错误';
        // ctx.body.data = err.errors;
      }
      // ctx.body = {
      //   code: status, // 服务端自身的处理逻辑错误(包含框架错误500 及 自定义业务逻辑错误533开始 ) 客户端请求参数导致的错误(4xx开始)，设置不同的状态码
      //   msg: error,
      // };
      // 虽然处理错误，但是请求是成功的，所以设置返回状态码为 200
      // ctx.status = 200;

      ctx.helper.error({
        ctx,
        code: status, // 服务端自身的处理逻辑错误(包含框架错误500 及 自定义业务逻辑错误533开始 ) 客户端请求参数导致的错误(4xx开始)，设置不同的状态码
        msg: error,
        detail: err.errors,
      });
    }
  };
};
