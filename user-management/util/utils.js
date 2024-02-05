const { OAuth2Client } = require('google-auth-library');
const conf = require('./env');
const users = require('../models/users');
const tempUsers = require('../models/tempUsers');
const axios = require('axios');

const CLIENT_ID = conf.CLIENT_ID;

const client = new OAuth2Client(CLIENT_ID);

const quotasURI = conf.quotas_uri;

const defaultUserQuotas = 5

// Verifies token provided by google amd retrieves user information
async function verify(token) {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID
        });
        const payload = ticket.getPayload();
        return payload
    } catch (err) {
        throw new Error("Error verifying token");
    }
}

// Adds the gratis quotas for new users
async function newUserQuotas(googleId) {
    try {
        // Sends post request to quotas microservice
        await axios.post(quotasURI + '/quotas-api/newUser', { googleId: googleId, quotas: defaultUserQuotas });
    } catch (err) {

        throw new Error("Could not add user quotas");
    }
}

// Adds new normal user to mongo DB
async function addUser(newUser) {
    try {
        const userToSave = new users({
            googleId: newUser.googleId,
            displayName: newUser.displayName,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            image: newUser.image,
            email: newUser.email,
        });
        // Saves user
        await userToSave.save();
        // Adds gratis quotas
        await newUserQuotas(newUser.googleId)
        return userToSave;
    } catch (err) {
        throw err;
    }
}

// Adds temporary user to temporary_users collection
async function addTempUser(tempUser) {

    try {
        const userToSave = new tempUsers({
            googleId: tempUser.sub,
            displayName: tempUser.name,
            firstName: tempUser.given_name,
            lastName: tempUser.family_name,
            image: tempUser.picture,
            email: tempUser.email,
        });

        // Stores temporary user
        await userToSave.save();
        return userToSave;
    } catch (err) {
        throw err;
    }
}


// Moves temporary user to normal users (and adds quotas)
async function replaceTempUser(googleId) {
    try {
        const toTranfer = await tempUsers.findOneAndRemove({ googleId: googleId });
        await addUser(toTranfer);
    } catch (err) {
        throw err;
    }
}


// Removes temporary user from mongo. 
async function deleteTempUser(googleId) {
    try {
        await tempUsers.findOneAndRemove({ googleId: googleId });
    } catch (err) {
        throw err;
    }
}

// Exports functions
module.exports = {
    verify,
    addUser,
    addTempUser,
    replaceTempUser,
    deleteTempUser
}