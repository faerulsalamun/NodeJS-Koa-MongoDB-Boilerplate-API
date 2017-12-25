/**
 * Created by faerulsalamun on 7/30/17.
 */

'use strict';

const mongoose = require(`mongoose`);
const crypto = require(`crypto`);
const moment = require(`moment`);
const config = require(`config`);

const timestamp = require(`./plugins/Timestamp`);

const Schema = mongoose.Schema;
const OAuthAccessTokenSchema = new Schema({

  tokenHash: {
    type: String,
    required: true,
  },

  // default 6 months from now
  expirationDate: {
    type: Date,
    default: moment().add(1, `years`).toDate(),
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

  scope: {
    type: String,
  },

}, { collection: `${config.database.mongodb.prefix}oauth_access_tokens` });

OAuthAccessTokenSchema.virtual(`token`)
    .get(function () {
      return this._token;
    })
    .set(function (value) {
      this._token = value;
      this.tokenHash = crypto.createHash(`sha1`).update(this._token).digest(`hex`);
    });

OAuthAccessTokenSchema.methods.updateExpirationDate = function () {
  this.expirationDate = moment().add(1, `years`).toDate();
  return;
};

OAuthAccessTokenSchema.plugin(timestamp.useTimestamps);

module.exports = mongoose.model(`OAuthAccessToken`, OAuthAccessTokenSchema);
