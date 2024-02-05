const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const conf = require('./util/env.js');

const port = conf.quotas_port;

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

mongoose.connect(conf.mongo_uri).then(() => {
    console.log("DB connected");
}).catch(err => 
    {
        console.log(err);
        console.log("There's no point in keeping the service on without its DB");
        process.exit(1);
    });


app.use('/quotas-api', require('./routes/routes'))
app.use('/admin', require('./routes/admin'));

app.listen( port, () =>{
    console.log("Quotas microservice is running on port", port);
});