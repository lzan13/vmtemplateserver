/**
 * Create by lzan13 2020/7/14
 * 描述：权限及认证相关中间件
 */
'use strict';
module.exports = options => {
  return async function(ctx, next) {
    // 校验 Token
    const authorization = ctx.get('Authorization');
    const token = authorization && authorization.replace('Bearer ', '');
    const result = await ctx.service.token.verify(token);
    // 判断 token 是否有效，反馈接口有些特殊，
    if (!result.verify) {
    // 有 token 和无 token 情况都可以访问，经过这里只是为了解析 token 携带的用户信息，方便保存反馈信息时带上用户信息
      if (ctx.path.includes('/feedback')) {
        return await next();
      }
      // token 校验失败，抛出异常，由 errorHandler 中间件统一处理
      ctx.throw(401, result.message);
    }
    ctx.state.user = result.data;
    // ctx.state.user 可以提取到 JWT 编码的 data
    const id = ctx.state.user.id;
    const identity = ctx.state.user.identity;

    // 这里有两种做法，第一种每次都查库校验角色，优点：实时，角色变更对用户无感。缺点：查库效率低，可考虑用redis
    // 第二种，把角色信息放进session,优点：无需查库，效率高。z缺点：角色变更时需额外逻辑来处理老的session，否则客户端的用户角色无法实时更新
    if (id) {
      if (identity === 1000) {
        ctx.logger.debug('身份：超级管理员');
      } else if (identity >= 900) {
        ctx.logger.debug('身份：管理员');
        // const reg = options.noPermission.admin;
        // if (reg.test(ctx.path)) {
        //   ctx.throw(403, '权限不足，请联系超级管理员开通权限');
        // }
      } else if (identity >= 800) {
        ctx.logger.debug('身份：运营者');
        const reg = options.noPermission.operation;
        if (reg.test(ctx.path)) {
          ctx.throw(403, '权限不足，请联系管理员开通权限');
        }
      } else if (identity >= 700) {
        ctx.logger.debug('身份：检查员');
        const reg = options.noPermission.operation;
        if (reg.test(ctx.path)) {
          ctx.throw(403, '权限不足，请联系管理员开通权限');
        }
      } else if (identity >= 100) {
        ctx.logger.debug('身份：VIP账户');

        const reg = options.noPermission.user;
        if (reg.test(ctx.path)) {
          ctx.throw(403, '权限不足，请联系管理员开通权限');
        }
      } else if (identity === 9) {
        ctx.logger.debug('身份：普通账户');

        const reg = options.noPermission.user;
        if (reg.test(ctx.path)) {
          ctx.throw(403, '权限不足，请联系管理员开通权限');
        }
      } else if (identity === 8) {
        ctx.logger.debug('身份：待激活账户');

        const reg = options.noPermission.user;
        if (reg.test(ctx.path)) {
          ctx.throw(403, '账户未激活，请先激活');
        }
      } else if (identity === 2) {
        ctx.logger.debug('身份：锁定用户');
        ctx.throw(403, '账户被锁定，如有疑问，请联系管理员');
      } else if (identity === 1) {
        ctx.logger.debug('身份：永久删除角色');
        ctx.throw(403, '账户被删除，如有疑问，请联系管理员');
      } else {
        ctx.logger.debug('身份：黑户');
        ctx.throw(403, '账户身份异常，请联系网站管理员赋予身份');
      }
      await next();
    } else {
      ctx.throw(401, 'Token 校验失败，请进行登录认证');
    }
  };
};
