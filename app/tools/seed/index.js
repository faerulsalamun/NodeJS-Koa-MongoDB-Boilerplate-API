/**
 * Created by faerulsalamun on 7/31/17.
 */

// Connect to db
const db = require(`../../helpers/database`);

// Seed your collection
require('./OAuthClient');

// Close DB
db.connection.close();
