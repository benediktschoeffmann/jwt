const conf = require('dotenv').config().parsed;
const compression = require('compression');
const express = require ('express');
const { loadKey, createKey } = require( "authkeys" );
const authkeys = require( "authkeys" ).middleware;
const jwt = require('jsonwebtoken');

const app = express()
app.use(express.json())
// app.use(compression())

app.get('/', function (req, res) {
    res.send('Hello');
})

app.get('/randomkey', function(req, res) {
    let authKey = createKey();
    res.json(authKey);
})

app.post('/sign', function(req, res) {
    // parse sent payload 
    let payload = req.body.payload;

    // enrich with expires-in property
    payload = Object.assign(payload, { exp : Math.floor(Date.now() / 1000) + (60 * 60)});
    
    // sign with default algorithm
    let token = jwt.sign(payload, conf.secret);

    // send token as response
    res.send(token);
})

app.listen(conf.port, () => {
    console.log(`JWT Service now running on port ${conf.port}`);
})