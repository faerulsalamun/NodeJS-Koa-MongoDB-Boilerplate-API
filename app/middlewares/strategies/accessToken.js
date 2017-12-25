/**
 * Created by faerulsalamun on 5/31/17.
 */

'use strict';

const passport = require(`koa-passport`);
const BearerStrategy = require(`passport-http-bearer`).Strategy;
const crypto = require(`crypto`);

// Models
const OAuthAccessToken = require(`../../models/OAuthAccessToken`);
const User = require(`../../models/User`);

// Services
const Utils = require(`../../services/Utils`);

async function getAccessToken(accessToken) {
  return await OAuthAccessToken.findOne({ tokenHash: accessToken })
      .lean()
      .exec();
}

async function getDataUser(userId, clientId) {
  const dataUser = await User.findOne(userId);

  return dataUser;
}

/**
 * This strategy is used to authenticate registered OAuth clients.
 * The authentication data must be delivered using the basic authentication scheme.
 */
passport.use(`accessToken`, new BearerStrategy((accessToken, done) => {
  const accessTokenHash = crypto.createHash(`sha1`).update(accessToken).digest(`hex`);

  getAccessToken(accessTokenHash)
        .then((dataAccessToken) => {
          if (!dataAccessToken) return done(null, false);
          if (Utils.getTimeNow() > dataAccessToken.expirationDate) {
            OAuthAccessToken.remove({ tokenHash: accessTokenHash }, (err) => {
              return done(err);
            });
          }

          // Get data user
          getDataUser(dataAccessToken.user_id, dataAccessToken.client_id)
                .then((user) => {
                  user.client_id = dataAccessToken.client_id;
                  if (!user) return done(null, false);
                  const info = { scope: `*` };
                  delete user.password;
                  done(null, user, info);
                })
                .catch(err => done(err));
        })
        .catch(err => done(err));
}));
