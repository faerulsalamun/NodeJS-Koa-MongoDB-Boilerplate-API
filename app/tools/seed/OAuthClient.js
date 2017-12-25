/**
 * Created by faerulsalamun on 7/31/17.
 */

'use strict';


// Models
const OAuthClient = require(`../../models/OAuthClient`);

// Services
const Utils = require(`../../services/Utils`);

async function seedOAuthClient() {
    const clientData = {
        name: `Android-App`,
        description: `Android Application Client`,
        trusted: true,
        secret: Utils.uid(32),
    };

     await OAuthClient.create(clientData);
}

seedOAuthClient();