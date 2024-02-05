const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const conf = require('./util/env.js');


const thumbnailServer = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

thumbnailServer.use('/thumbnails', express.static('thumbnails'));

const port = conf.database_port;
const portThumbnails = conf.database_thumbnail_port;
const db_URI = conf.mongo_uri;


mongoose.connect(db_URI).then(() => {
    console.log("DB connected");
}).catch(err => 
    {
        console.log(err);
        console.log("There's no point in keeping the service on without its DB");
        process.exit(1);
    });

app.use('/', require('./routes/create'));
app.use('/', require('./routes/dashboard'));
app.use('/admin', require('./routes/admin'));


const https = require('https');
const privateKey =  conf.https_key;
const certificate =  conf.https_certificate;

const credentials = { key: privateKey, cert: certificate };
const server = https.createServer(credentials, thumbnailServer);
//Start the server

app.listen(port, () => {
 console.log("DB microservice is running on port", port);
});
server.listen(portThumbnails, () => {
    console.log('Thumbnails server on port', portThumbnails)
});
