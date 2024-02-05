const jwt = require('jsonwebtoken');

/* This middleware verifies the token found either in the cookies
 * or in the params of the request. If verified then proceeds to
 * next function, if not redirects to authentication failed page
 */

function auth(req, res, next){
    try {
        // Sets token from cookie or params
        const token = req.params.token || req.cookies['token'];
        // Verifies jwt
        const decoded = jwt.verify(token, 'mykey'); 
        // Passed googleId in the decoded token to req.googleId
        req.googleId = decoded.googleId;
        next();
    } catch (err) {

        res.redirect('/auth_failed');

    }
}

module.exports = { auth };
