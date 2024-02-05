const express = require('express');
const bodyParser = require('body-parser');


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = require('./util/env').bubble_port;

app.use('/', require('./routes/routes'));

app.listen( port, () =>{
    console.log(`Bubble-ms running on port ${port}`);
})
