/**
 * Created by faerulsalamun on 7/29/17.
 */

'use strict';

const mongoose = require(`mongoose`);
const validate = require(`mongoose-validator`);
const validator = validate.validatorjs;
const uniqueValidator = require(`mongoose-unique-validator`);
const bcrypt = require(`bcryptjs`);
const config = require(`config`);
const Utils = require(`../services/Utils`);
const timestamp = require(`./plugins/Timestamp`);

const emailValidator = [
  validate({
    validator: `isEmail`,
    message: `Email is not in valid format`,
    http: 400,
  }),
];

const Schema = mongoose.Schema;
const UserSchema = new Schema({

  email: {
    type: String,
    required: true,
    unique: true,
    validate: emailValidator,
  },

  username: {
    type: String,
    required: true,
  },

  passwordHash: {
    type: String,
    required: [true, `Path \`password\` is required.`],
  },

  state: {
    type: String,
    default: `init`,
    enum: [`init`, `verified`, `removed`, `banned`, `deactive`],
  },
  role: {
    type: [String],
    default: [`user`],
  },

}, {
  collection: `${config.database.mongodb.prefix}users`,
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
  },
});

UserSchema.plugin(timestamp.useTimestamps);

UserSchema.plugin(uniqueValidator, { message: `{PATH} already taken` });

// Password validation
UserSchema.virtual(`password`)
    .get(function () {
      return this._password;
    })
    .set(function (value) {
      this._password = value;

      if (typeof value !== `undefined`) {
        this.passwordHash = bcrypt.hashSync(this._password, 10);
      }
    });

UserSchema.virtual(`passwordConfirmation`)
    .get(function () {
      return this._passwordConfirmation;
    })
    .set(function (value) {
      this._passwordConfirmation = value;
    });

UserSchema.path(`passwordHash`).validate(function (v) {
  if (this._password || this._passwordConfirmation) {
    if (this._password.length < 6) {
      this.invalidate(`password`,
                `Password minimum length is 6 character`);
    }

    if (this._password !== this._passwordConfirmation) {
      this.invalidate(`passwordConfirmation`, `Password confirmation must match.`);
    }
  }

  if (this.isNew && !this._password) {
    this.invalidate(`password`, `Password is required.`);
  }
}, null);

UserSchema.path(`username`).validate(function (v) {
  // Check username regex
  const username = Utils.checkRegexUsername(this.username);
  let checkUsername = false;

  for (let i = 0, length = username.length; i < length; i += 1) {
    if (this.username === username[i]) {
      checkUsername = true;
      break;
    }
  }

  if (!checkUsername) {
    this.invalidate(`username`,
            `Invalid format username`);
  }
}, null);

UserSchema.methods.passwordMatches = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.passwordHash, (err, isMatch) => {
    if (err) return cb(err);
    return cb(null, isMatch);
  });
};

UserSchema.method(`toJSON`, function () {
  const user = this.toObject();

  delete user.password;
  delete user.passwordConfirmation;
  delete user.passwordHash;
  delete user.id;

  return user;
});

module.exports = mongoose.model(`User`, UserSchema);
