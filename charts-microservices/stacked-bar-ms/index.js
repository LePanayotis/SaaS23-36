const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = require('./util/env').stacked_bar_port;

app.use('/public', express.static('public'));
app.use('/', require('./routes/routes'));

app.listen( port, () =>{
    console.log(`Scatter-ms running on port ${port}`);
})
