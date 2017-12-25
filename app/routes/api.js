/**
 * Created by faerulsalamun on 4/25/17.
 */


'use strict';

const Router = require(`koa-router`);
const router = new Router();
const auth = require(`../middlewares/authenticated`);
const passport = require(`koa-passport`);
const koaBody = require(`koa-body`)({ multipart: true });

const AuthController = require(`../controllers/AuthController`);
const OAuthController = require(`../controllers/OAuthController`);
const MeController = require(`../controllers/MeController`);

module.exports = (app) => {
  const router = new Router({
    prefix: `/api/v1`,
  });

  // Auth
  router.post(`/register`, auth.isAuthenticatedApiBasic(), AuthController.register);

  // Me
  router.get(`/me`, auth.isAuthenticatedAccessToken(), MeController.show);

    // OAuth2
  router.post(`/login`, auth.isAuthenticatedPassword(), OAuthController.getTokenDirectPassword);
  router.post(`/refresh_token`, auth.isAuthenticatedApiBasic(), OAuthController.getRefreshTokenDirectPassword);

  app
        .use(router.routes())
        .use(router.allowedMethods());
};
