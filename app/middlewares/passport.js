/**
 * Created by faerulsalamun on 4/24/17.
 */

'use strict';

const passport = require(`koa-passport`);

require(`./strategies/clientBasic`);
require(`./strategies/clientPassword`);
require(`./strategies/accessToken`);

const fetchUser = (() => {
  const user = { id: 1, username: `test`, password: `test` };
  return async function () {
    return user;
  };
})();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await fetchUser();
    done(null, user);
  } catch (err) {
    done(err);
  }
});
