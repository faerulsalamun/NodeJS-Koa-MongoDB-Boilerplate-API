/**
 * Created by faerulsalamun on 7/30/17.
 */

'use strict';

const Utils = require(`../../services/Utils`);

exports.useTimestamps = (schema, options) => {
  schema.add({
    createdTime: Date,
    updatedTime: Date,
  });

  schema.pre(`save`, function (next) {
    if (!this.createdTime) {
      this.createdTime = this.updatedTime = Utils.getTimeNow();
    } else {
      this.updatedTime = Utils.getTimeNow();
    }

    next();
  });
};
