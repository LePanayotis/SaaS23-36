const jwt = require('jsonwebtoken');

/*
 * Middleware used to verify that a user that wants to sing up
 * is authorised by the users microservice
 */

function authNewUser(req, res, next){
    try {
        const token = req.params.token || req.cookies['token'];
        const decoded = jwt.verify(token, 'tempuser'); // Replace with your secret key

        req.googleId = decoded.googleId;
        req.email = decoded.email;
        next();
    } catch (err) {
        res.redirect('/auth_failed');
    }
}


module.exports = { authNewUser }
