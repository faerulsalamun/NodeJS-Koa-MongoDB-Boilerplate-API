/**
 * Created by faerulsalamun on 07/29/17.
 */

'use strict';

const Koa = require(`koa`);
const app = new Koa();
const config = require(`config`);
const session = require(`koa-generic-session`);
const redisStore = require(`koa-redis`);
const convert = require(`koa-convert`);
const passport = require(`koa-passport`);
const debug = require(`debug`)(`app`);
const bodyParser = require(`koa-bodyparser`);
const bouncer = require(`koa-bouncer`);
const mw = require(`./app/middlewares/validation`);
const cors = require(`kcors`);
const responseHandler = require(`./app/middlewares/response`);
const winston = require(`winston`);
const locale = require(`koa-locale`); //  detect the locale
const i18n = require(`koa-i18n`);

// Database
require(`./app/helpers/database`);

// Passport
require(`./app/middlewares/passport`);

// Locale
locale(app);
app.use(i18n(app, {
  directory: `./config/locales`,
  locales: [`en`], //  `zh-CN` defualtLocale, must match the locales to the filenames
}));

// Setup KOA
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser());
app.use(cors());
app.keys = [`your-session-secret`];
app.use(convert(session({
  store: redisStore(),
})));

// Middleware
app.use(bouncer.middleware());
app.use(mw.handleBouncerValidationError());
app.use(responseHandler({ contentType: `application/json` }));

// Logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  debug(`${ctx.method} ${ctx.url} - ${ms}`);
});

// routes
require(`./app/routes/api`)(app);

app.listen(config.server.port, () => {
  winston.info(`NodeJS Koa MongoDB Boilerplate API run on ${config.server.host} port ${config.server.port}`);
});
