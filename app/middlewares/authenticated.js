/**
 * Created by faerulsalamun on 4/24/17.
 */

'use strict';

const passport = require(`koa-passport`);
const _ = require(`lodash`);

exports.isAuthenticated = (role) => {
  return async (ctx, next) => {
    if (role && _.intersection(role, ctx.req.user.role_id_all).length === 0) {
      return ctx.res.forbidden();
    }

    return await next();
  };
};


exports.isAuthenticatedAccessToken = () => {
  return async(ctx, next) => {
    await passport.authenticate(`accessToken`, { session: false }, async(err, user) => {
      if (!user || err) {
        return ctx.throw(401);
      }

      ctx.state.user = user;
      return await next();
    })(ctx, next);
  };
};

exports.isAuthenticatedApiBasic = () => {
  return async(ctx, next) => {
    await passport.authenticate(`clientBasic`, { session: false }, async(err, user) => {
      if (!user || err) {
        return ctx.throw(401);
      }
      ctx.state.user = user;

      return await next();
    })(ctx, next);
  };
};

exports.isAuthenticatedPassword = () => {
  return async(ctx, next) => {
    await passport.authenticate(`clientPassword`, { session: false }, async(err, user) => {
      if (!user || err) {
        return ctx.throw(401);
      }
      ctx.state.user = user;
      return await next();
    })(ctx, next);
  };
};

exports.isAuthenticatedMulti = () => {
  return async(ctx, next) => {
    await passport.authenticate([`clientBasic`, `accessToken`], { session: false }, async(err, user) => {
      if (!user || err) {
        return ctx.throw(401);
      }
      ctx.state.user = user;
      return await next();
    })(ctx, next);
  };
};
