/**
 * Created by faerulsalamun on 5/15/17.
 */

'use strict';

const bouncer = require(`koa-bouncer`);
const Utils = require(`../services/Utils`);

exports.handleBouncerValidationError = () => {
  return async(ctx, next) => {
    try {
      await next();
      // Handle 404 upstream.
      const status = ctx.status;
      if (status === 404) {
        ctx.status = 404;
        ctx.body = {
          meta: {
            code: 404,
            status: false,
            messages: `Not Found`,
          },
        };
      }
    } catch (err) {
      let code = err.status;

      if (err instanceof bouncer.ValidationError) {
        err.message = err.message || `Validation error`;
      } else if (err.name === `ValidationError`) {
        err.message = Utils.showErrorValidationMongo(err).message;
        code = Utils.checkErrorCode(Utils.showErrorValidationMongo(err));
      }

      // Set our response.
      ctx.status = code || 400;
      ctx.body = {
        meta: {
          code,
          status: false,
          messages: err.message,
        },
      };

      // return ctx.app.emit(`error`, err, this);
    }
  };
};
