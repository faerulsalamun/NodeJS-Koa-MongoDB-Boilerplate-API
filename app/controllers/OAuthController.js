/**
 * Created by faerulsalamun on 7/31/17.
 */

'use strict';


// Lib
const moment = require(`moment-timezone`);
const oauth2orize = require(`oauth2orize-koa`);
const passport = require(`koa-passport`);
const Promise = require(`bluebird`);
const bcrypt = Promise.promisifyAll(require(`bcrypt`));
const crypto = require(`crypto`);
const _ = require(`lodash`);

// create OAuth 2.0 server
const server = oauth2orize.createServer();

// Models
const OAuthClient = require(`../models/OAuthClient`);
const User = require(`../models/User`);
const OAuthAccessToken = require(`../models/OAuthAccessToken`);
const OAuthRefreshToken = require(`../models/OAuthRefreshToken`);

// Services
const Utils = require(`../services/Utils`);

/* Resource owner password flow. */
server.exchange(oauth2orize.exchange.password(async(client, username, password, scope, body, ctx) => {
  // Check username or email
  let isEmail = false;

  // Check email regex
  if (Utils.checkRegexEmail(username)) {
    isEmail = true;
  }

  let dataUser;

  if (isEmail) {
    // Check with email
    dataUser = await User.findOne({ email: username }).lean().exec();
  } else {
    // Check with username
    dataUser = await User.findOne({ username }).lean().exec();
  }

  // Check data
  if (_.isEmpty(dataUser)) {
    const err = new Error(ctx.i18n.__(`INCORRECT_USERNAME_OR_PASSWORD`));
    err.status = 401;
    throw err;
  }

  // Check Password
  const userPassword = _.isEmpty(dataUser.passwordHash) ? `` : dataUser.passwordHash;

  if (!_.isEmpty(password)) {
    const isValid = await bcrypt.compareAsync(password, userPassword);

    if (!isValid) {
      const err = new Error(ctx.i18n.__(`INCORRECT_USERNAME_OR_PASSWORD`));
      err.status = 401;
      throw err;
    }
  }

  // Check user verified
  if (dataUser.state !== `verified`) {
    const err = new Error(ctx.i18n.__(`ACCOUNT_NOT_VERIFIED`));
    err.status = 401;
    throw err;
  }

  // Search data access token
  const accessToken = await OAuthAccessToken.findOne({
    user_id: dataUser._id, client_id: client._id,
  }).lean().exec();

  if (accessToken) {
    // Remove access token
    await OAuthAccessToken.remove({
      user_id: dataUser._id, client_id: client._id,
    }).lean().exec();
  }

  // Search data refresh token
  const refreshToken = await OAuthRefreshToken.findOne({
    user_id: dataUser._id, client_id: client._id,
  }).lean().exec();

  if (refreshToken) {
    // Remove refresh token
    await OAuthRefreshToken.remove({
      user_id: dataUser._id, client_id: client._id,
    }).lean().exec();
  }

  const dataAccessToken = {
    token: Utils.uid(128),
    client_id: client._id,
    user_id: dataUser._id,
  };

  const saveAccessToken = await OAuthAccessToken.create(dataAccessToken);

  const dataRefreshToken = {
    token: Utils.uid(128),
    client_id: client._id,
    user_id: dataUser._id,
  };

  const saveRefreshToken = await OAuthRefreshToken.create(dataRefreshToken);

  return [saveAccessToken.token, saveRefreshToken.token, {
    expired_in: saveAccessToken.expirationDate,
  }];
}));

/* Resource owner refresh token flow. */
server.exchange(oauth2orize.exchange.refreshToken(async(client, refreshToken, scope, ctx) => {
  const refreshTokenHash = crypto.createHash(`sha1`).update(refreshToken).digest(`hex`);

  const dataRefreshToken = await OAuthRefreshToken.findOne({ tokenHash: refreshTokenHash });

  if (!dataRefreshToken) {
    const err = new Error(ctx.i18n.__(`INCORRECT_REFRESH_TOKEN`));
    err.status = 401;
    throw err;
  }

  if (client._id.toString() !== dataRefreshToken.client_id.toString()) {
    const err = new Error(ctx.i18n.__(`INCORRECT_REFRESH_TOKEN`));
    err.status = 401;
    throw err;
  }

  const dataAccessToken = await OAuthAccessToken.findOne({ user_id: dataRefreshToken.user_id });

  if (!dataAccessToken) {
    const err = new Error(ctx.i18n.__(`INCORRECT_REFRESH_TOKEN`));
    err.status = 401;
    throw err;
  }

  if (client._id.toString() !== dataAccessToken.client_id.toString()) {
    const err = new Error(ctx.i18n.__(`INCORRECT_REFRESH_TOKEN`));
    err.status = 401;
    throw err;
  }

  // Refresh Access Token
  dataAccessToken.token = Utils.uid(128);
  dataAccessToken.updateExpirationDate();
  dataAccessToken.scope = scope || ``;

  // Refresh Token
  dataRefreshToken.token = Utils.uid(128);
  dataRefreshToken.updateExpirationDate();
  dataRefreshToken.scope = scope || ``;

  const saveDataAccessToken = await dataAccessToken.save();
  const saveDataRefreshToken = await dataRefreshToken.save();

  return [saveDataAccessToken.token, saveDataRefreshToken.token, {
    expired_in: saveDataAccessToken.expirationDate,
  }];
}));


module.exports = {

  token: [
    passport.authenticate([`clientBasic`], {
      session: false,
    }),
    server.token(),
  ],

  bearer: [
    passport.authenticate(`accessToken`, {
      session: false,
    }),
  ],

  /**
   * @api {post} /login Login
   * @apiName Login
   * @apiGroup Auth
   * @apiVersion  0.0.1
   * @apiPermission User, Admin
   *
   * @apiParam {String} username Username of the User.
   * @apiParam {String} password Password of the User.
   * @apiParam {String} grant_type Grant Type of the User.
   * @apiParam {String} client_id Client Id of the Application.
   * @apiParam {String} client_secret Client Secret of the Application.
   *
   * @apiParamExample {json} Request-Example:
     {
        "email": "faerulsalamun@five-code.com",
        "username": "faerul",
        "password": "12345678",
        "passwordConfirmation": "12345678"
    }
   * @apiSuccess {String} access_token access_token of the User.
   * @apiSuccess {String} refresh_token  refresh_token of the User.
   * @apiSuccess {String} expired_in  expired_in of the User.
   * @apiSuccess {String} token_type  token_type of the User.
   *
   * @apiSuccessExample {type} Success-Response:
     {
       "access_token": "123456",
       "refresh_token": "123456",
       "expired_in": "2018-07-31T00:34:37.141Z",
       "token_type": "Bearer"
     }
   */
  getTokenDirectPassword: server.token(),

  /**
   * @api {post} /refresh_token Refresh Token
   * @apiName Refresh Token
   * @apiGroup Auth
   * @apiVersion  0.0.1
   * @apiPermission User, Admin
   *
   * @apiParam {String} refresh_token Refresh Token of the User
   * @apiParam {String} grant_type Grant Type Password of the User.
   *
   * @apiParamExample {json} Request-Example:
    {
      "refresh_token" : "123456",
      "grant_type": "refresh_token"
    }
   * @apiSuccess {String} access_token access_token of the User.
   * @apiSuccess {String} refresh_token  refresh_token of the User.
   * @apiSuccess {String} expired_in  expired_in of the User.
   * @apiSuccess {String} token_type  token_type of the User.
   *
   * @apiSuccessExample {type} Success-Response:
    {
      "access_token": "123456",
      "refresh_token": "123456",
      "expired_in": "2018-07-31T00:34:37.141Z",
      "token_type": "Bearer"
    }
   */
  getRefreshTokenDirectPassword: server.token(),

};
