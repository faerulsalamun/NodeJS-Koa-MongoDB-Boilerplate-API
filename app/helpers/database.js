/**
 * Created by faerulsalamun on 7/29/17.
 */

'use strict';


const mongoose = require(`mongoose`);
const config = require(`config`);
const winston = require(`winston`);
mongoose.Promise = require(`bluebird`);

// mongodb connection
const options = {
  server: {
    socketOptions: {
      keepAlive: 1,
    },
    poolSize: 5,
  },
  user: config.database.mongodb.username,
  pass: config.database.mongodb.password,
  useMongoClient: false,
};

mongoose.connect(`mongodb://${config.database.mongodb.username}:${config.database.mongodb.password}@${config.database.mongodb.host}:${config.database.mongodb.port}/${config.database.mongodb.dbname}`, options);

mongoose.connection.on(`connected`, () => {
  winston.info(`Mongoose default connection open to ${config.database.mongodb.username}:${config.database.mongodb.password}@${config.database.mongodb.host}:${config.database.mongodb.port}/${config.database.mongodb.dbname}`);
});

mongoose.connection.on(`error`, (err) => {
  winston.info(`Mongoose default connection error: ${err}`);
});

mongoose.connection.on(`disconnected`, () => {
  winston.info(`Mongoose default connection disconnected`);
});

process.on(`SIGINT`, () => {
  mongoose.connection.close(() => {
    winston.info(`Mongoose default connection disconnected through app termination`);
    process.exit(0);
  });
});

module.exports = mongoose;
