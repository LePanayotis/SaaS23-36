const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const conf = require('./util/env');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = conf.polar_area_port;


app.use('/', require('./routes/routes'));


// const https = require('https');
// const privateKey = fs.readFileSync('C:\\Users\\ppapa\\Desktop\\SaaS23-36\\private.key', 'utf8');
// const certificate = fs.readFileSync('C:\\Users\\ppapa\\Desktop\\SaaS23-36\\certificate.crt', 'utf8');

// const credentials = { key: privateKey, cert: certificate };
// const server = https.createServer(credentials, app);
// Start the server

app.listen( port, () =>{
    console.log(`Polar-area-ms running on port ${port}`);
})
