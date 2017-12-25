/**
 * Created by faerulsalamun on 4/24/17.
 */

'use strict';

const passport = require(`koa-passport`);
const BasicStrategy = require(`passport-http`).BasicStrategy;

// Models
const OAuthClient = require(`../../models/OAuthClient`);

async function getOauthClient(secretId, secret) {
  return await OAuthClient.findOne({ _id: secretId, secret })
      .lean()
      .exec();
}

/**
 * This strategy is used to authenticate registered OAuth clients.
 * The authentication data must be delivered using the basic authentication scheme.
 */
passport.use(`clientBasic`, new BasicStrategy((clientId, clientSecret, done) => {
  getOauthClient(clientId, clientSecret)
        .then((client) => {
          if (clientId === client._id.toString() && clientSecret === client.secret) {
            done(null, client);
          } else {
            done(null, false);
          }
        })
        .catch(err => done(err));
}));
