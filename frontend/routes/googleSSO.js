const axios = require('axios');
const router = require('express').Router();
const { authNewUser }= require('../middleware/authNewUser');
const conf = require('../util/env');


/*
 * Endpoint used by google api to implement login-signup with Google
 * Google provides a json with data that is forwarded to users microservice for verification
 */
router.post('/googleSSO', async (req, res) => {
    try {
        // Forwards to users microservice
        const { data } = await axios.post(`${conf.users_uri}/user-api/login/google`, req.body);

        const token = data.token;
        const isNewUser = data.isNewUser;

        // Sets cookie to token returned by users microservice
        res.cookie('token', token)

        // Asks the user to confirm signup if new user, otherwise send dashboard
        if (isNewUser) {
            res.redirect(`/login/confirm`)
        } else {
            res.redirect('/dashboard');
        }


    } catch (err) {
        console.log('Problem in login with google');
        res.render('error',  {error: 'User authentication service is unavailable. Please try again later.'});
    }

})


// Renders confirm signup page, only for auth 'temporary users'
router.get('/confirm', authNewUser, (req, res) => {
    const email = req.email;
    res.render('approve', {email: email});
})


// If the temporary user accepts sign up, then they are converted to normal users
// The temporary user token is  exchanged for a normal user token that allows acces to all normal user services
// Needs temporary user authorisation
router.get('/confirm/approve', authNewUser, async (req, res) => {

    const googleId = req.googleId;
    try{

        // Ask users microservice for a normal user token. Temporary user becomes normal user
        const { data } = await axios.get(`${conf.users_uri}/user-api/exchangetoken/${googleId}`);
        
        
        const token = data.token;
        const isNewUser = data.isNewUser;

        // Updates token
        res.cookie('token', token)


        if(!isNewUser){
            // Temporary user token exchanged successfully
            res.redirect('/dashboard');
        } else {
            // Error in token exchange
            res.render('error')
        }
    } catch(err){
        res.render('error', {error: 'User authentication service is unavailable. Please try again later.'});
    }   
})

// If the temporary user rejects sign up, then they are deleted from users microservice as temporary users
// Endpoin only for temporary users
router.get('/confirm/disapprove', authNewUser, async (req, res) => {
    const googleId = req.googleId;
    try{
        // Deletes temporary user from users microservice
        await axios.delete(`${conf.users_uri}/user-api/undoUser/${googleId}`);
        res.redirect('/');

    } catch(err){

        res.render('error', {error: 'User authentication service is unavailable.'});
    } 
})

module.exports = router;