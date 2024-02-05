const users = require('../models/users');
const { verify, replaceTempUser, addTempUser, deleteTempUser } = require('../util/utils')
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const conf = require('../util/env.js');


// Secret keys for jwt hash generation
const secretKey = conf.secretKey;
const secretKeyTempUser = conf.secretKeyTempUser;

// Expiration time for authorisation tokens
const expTime = 6000; 


/*
* Receives user info from Google and verifies the credential provided with 0A2auth
* If the user is new, they are added to the temporaty users collection uand a temporary token
* is returned. If user already exists, returns a signed jwt token with some user info.
*/
router.post('/login/google', async (req, res) => {
    try {

        // Verifies google credential
        const payload = await verify(req.body.credential);
        // Checks if user already exists in mongo
        const user = await users.findOne({ googleId: payload.sub });
        let token;
        let isNewUser;

        if (user) {
            // User exists already
            isNewUser = false;
            token = jwt.sign({ googleId: payload.sub }, secretKey , { expiresIn: expTime })
        } else{
            // User does not exist, added to temporary users for token exchange after approval
            await addTempUser(payload);
            isNewUser = true;
            token = jwt.sign({ googleId: payload.sub, email: payload.email }, secretKeyTempUser, { expiresIn: expTime })
        }
        // Send token to frontend - orchestrator
        res.send({ token: token , isNewUser: isNewUser});
    } catch (err) {
        res.status(500).send("Error in login process");
    }
});


// Exhange temporary user token for normal user token
router.get('/exchangetoken/:googleId', async (req, res) => {
    const googleId = req.params.googleId;
    try {
        // Removes user from temporary collection and moves to normal collection
        await replaceTempUser(googleId);
        
        // Sends signed token
        token = jwt.sign({ googleId: googleId }, secretKey, { expiresIn: expTime }); 
        
        res.send({ token: token, isNewUser: false });
    } catch (err) {
        res.status(500).send("Error in temporary user exchange");
    }
})


// Used when user rejcts the terms, to delete from temporary collection
router.delete('/undoUser/:googleId', async (req, res) => {
    const googleId = req.params.googleId;
    try {
        // Deletes temporary user from collection
        await deleteTempUser(googleId);
        res.status(200).send("User deleted");

    } catch (err) {
        res.status(500).send("Error in temporary user deletion");
    }
})

// Deletes a user from normal user collection, provided that the token is valid
router.delete('/deleteUser/:token', async (req, res) => {
    try {
        const token = req.params.token;
        const decoded = jwt.verify(token, secretKey);
        await users.deleteOne({ googleId: decoded.googleId });
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Error in user deletion");
    }
})

// Gets the user info for a provided token
router.get('/getUser/:token', async (req, res) => {
    try {
        const token = req.params.token;
        // Checks token iwth jwt
        const decoded = jwt.verify(token, secretKey);

        // Searches in mongo
        const user = await users.findOne({ googleId: decoded.googleId });
        if (user) {
            // User exists
            res.json(user);
        } else {
            // User does not exist
            res.status(404).send("User not found");
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})


module.exports = router;