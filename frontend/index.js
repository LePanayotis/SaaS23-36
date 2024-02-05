const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const conf = require('./util/env.js');

const app = express();

//Configures express app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.set('view engine', 'ejs');



//Sets static public endpoints
app.use('/public', express.static('public'));


//Sets dynamic endpoints
app.use('/admin', require('./routes/admin'));
app.use('/login', require('./routes/googleSSO'));
app.use('/', require('./routes/pages'));
app.use('/api', require('./routes/api'));


//404 response page
app.use((req, res) => {
    res.status(404).render('error', { error: '404 - Resource not found :\'(' })
})


//Creates and configures server to run on https
const https = require('https');
const privateKey =  conf.https_key;
const certificate =  conf.https_certificate;

const credentials = { key: privateKey, cert: certificate };

const server = https.createServer(credentials, app);

// Start the server
server.listen(443, () => {
    console.log('Server running on HTTPS');
});
