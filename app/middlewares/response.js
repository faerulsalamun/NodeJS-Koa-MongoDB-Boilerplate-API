/**
 * Response middleware for koajs
 *
 * @author Nick Rucci <nick@rucci.io>
 * @link https://github.com/potatogopher/koa-response-handler
 */

/**
 * Status codes
 *
 * TODO: add all status codes
 */

'use strict';

const statusCodes = {
  CONTINUE: 100,
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  REQUEST_TIME_OUT: 408,
  IM_A_TEAPOT: 418,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIME_OUT: 504,
};

module.exports = (opts = {}) => {
  const { contentType = `text/plain` } = opts;

  return async (ctx, next) => {
    // 100 CONTINUE
    ctx.res.continue = (res = {}) => {
      ctx.type = contentType;
      ctx.body = res;
      ctx.status = statusCodes.CONTINUE;
    };

    // 200 OK
    ctx.res.ok = (res = { }) => {
      ctx.type = contentType;
      ctx.body = {
        meta: {
          code: statusCodes.OK,
          status: true,
          messages: `Ok`,
        },
        data: res,
      };
      ctx.status = statusCodes.OK;
    };

    // 201 CREATED
    ctx.res.created = (res = {}) => {
      ctx.type = contentType;
      ctx.body = {
        meta: {
          code: statusCodes.CREATED,
          status: true,
          messages: `Created`,
        },
        data: res,
      };
      ctx.status = statusCodes.CREATED;
    };

    // 202 ACCEPTED
    ctx.res.accepted = (res = {}) => {
      ctx.type = contentType;
      ctx.body = res;
      ctx.status = statusCodes.ACCEPTED;
    };

    // 204 NO CONTENT
    ctx.res.noContent = (res = {}) => {
      ctx.type = contentType;
      ctx.body = {
        meta: {
          code: statusCodes.NO_CONTENT,
          status: true,
          messages: `No Content`,
        },
      };
      ctx.status = statusCodes.NO_CONTENT;
    };

    // 400 BAD REQUEST
    ctx.res.badRequest = (res = { }) => {
      ctx.type = contentType;
      ctx.body = {
        meta: {
          code: statusCodes.BAD_REQUEST,
          status: false,
          messages: res,
        },
      };
      ctx.status = statusCodes.BAD_REQUEST;
    };

    // 401 UNAUTHORIZED
    ctx.res.unauthorized = (res = {}) => {
      ctx.type = contentType;
      ctx.body = {
        meta: {
          code: statusCodes.UNAUTHORIZED,
          status: false,
          messages: `Unauthorized`,
        },
      };
      ctx.status = statusCodes.UNAUTHORIZED;
    };

    // 403 FORBIDDEN
    ctx.res.forbidden = (res = {}) => {
      ctx.type = contentType;
      ctx.body = {
        meta: {
          code: statusCodes.FORBIDDEN,
          status: false,
          messages: `Forbidden`,
        },
      };
      ctx.status = statusCodes.FORBIDDEN;
    };

    // 404 NOT FOUND
    ctx.res.notFound = (res = {}) => {
      ctx.type = contentType;
      ctx.body = {
        meta: {
          code: statusCodes.NOT_FOUND,
          status: false,
          messages: `Not Found`,
        },
      };
      ctx.status = statusCodes.NOT_FOUND;
    };

    // 408 REQUEST TIME OUT
    ctx.res.requestTimeOut = (res = {}) => {
      ctx.type = contentType;
      ctx.body = res;
      ctx.status = statusCodes.REQUEST_TIME_OUT;
    };

    // 418 I'M A TEAPOT
    ctx.res.teapot = (res = `I'm a teapot`) => {
      ctx.type = contentType;
      ctx.body = res;
      ctx.status = statusCodes.IM_A_TEAPOT;
    };

    // 500 INTERNAL SERVER ERROR
    ctx.res.internalServerError = (res = {}) => {
      ctx.type = contentType;
      ctx.body = res;
      ctx.status = statusCodes.INTERNAL_SERVER_ERROR;
    };

    // 501 NOT IMPLEMENTED
    ctx.res.notImplemented = (res = {}) => {
      ctx.type = contentType;
      ctx.body = res;
      ctx.status = statusCodes.NOT_IMPLEMENTED;
    };

    // 502 BAD GATEWAY
    ctx.res.badGateway = (res = {}) => {
      ctx.type = contentType;
      ctx.body = res;
      ctx.status = statusCodes.BAD_GATEWAY;
    };

    // 503 SERVICE UNAVAILABLE
    ctx.res.serviceUnavailable = (res = {}) => {
      ctx.type = contentType;
      ctx.body = res;
      ctx.status = statusCodes.SERVICE_UNAVAILABLE;
    };

    // 504 GATEWAY TIME OUT
    ctx.res.gatewayTimeOut = (res = {}) => {
      ctx.type = contentType;
      ctx.body = res;
      ctx.status = statusCodes.GATEWAY_TIME_OUT;
    };

    return next();
  };
};
