/**
 * Created by faerulsalamun on 7/30/17.
 */


'use strict';

const mongoose = require(`mongoose`);
const config = require(`config`);
const timestamp = require(`./plugins/Timestamp`);

// Services
const Utils = require(`../services/Utils`);

const Schema = mongoose.Schema;
const OAuthClientSchema = new Schema({

  secret: {
    type: String,
    default: Utils.uid(32),
  },

  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    default: ``,
  },

  // possible values: ['default_read', 'default_write'] and maybe others
  scope: {
    type: [String],
    default: [`default_read`, `default_write`],
  },

  // if this app allowed to get token with resource owner password flow
  trusted: {
    type: Boolean,
    default: false,
  },

  // this is for Authorization Code Flow, aka Server-Side Flow
  redirectUri: {
    type: String,
    default: ``,
    //validate: urlValidator,
  },

  website: {
    type: String,
    default: ``,
  },

}, {
  collection: `${config.database.mongodb.prefix}oauth_clients`,
});

OAuthClientSchema.plugin(timestamp.useTimestamps);

module.exports = mongoose.model(`OAuthClient`, OAuthClientSchema);
