const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const conf = require('./util/env.js')

const port = conf.users_port;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

mongoose.connect(conf.mongo_uri,  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
  

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

db.once('connected', () => {
  console.log('Connected to MongoDB');
});

db.on('disconnected', () => {
  console.log('Disconnected from MongoDB');
});

app.use('/user-api', require('./routes/routes'))
app.use('/admin', require('./routes/admin'))

app.listen( port, () => {
    console.log("User microservice is running on port", port);
});