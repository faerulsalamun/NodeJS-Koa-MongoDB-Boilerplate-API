/**
 * Created by faerulsalamun on 7/30/17.
 */

'use strict';

const mongoose = require(`mongoose`);
const crypto = require(`crypto`);
const moment = require(`moment-timezone`);
const config = require(`config`);
const timestamp = require(`./plugins/Timestamp`);

const Schema = mongoose.Schema;
const OAuthRefreshTokenSchema = new Schema({

  tokenHash: {
    type: String,
    required: true,
  },

  client_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: `OAuthClient`,
  },

  user_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: `User`,
  },


}, {
  collection: `${config.database.mongodb.prefix}oauth_refresh_tokens`
});

OAuthRefreshTokenSchema.virtual(`token`)
    .get(function () {
      return this._token;
    })
    .set(function (value) {
      this._token = value;
      this.tokenHash = crypto.createHash(`sha1`).update(this._token).digest(`hex`);
    });

OAuthRefreshTokenSchema.methods.updateExpirationDate = function () {
  this.expirationDate = moment().add(1, `years`).toDate();
  return;
};

OAuthRefreshTokenSchema.plugin(timestamp.useTimestamps);

module.exports = mongoose.model(`OAuthRefreshToken`, OAuthRefreshTokenSchema);
