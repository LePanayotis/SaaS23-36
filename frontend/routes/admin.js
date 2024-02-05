const router = require('express').Router();
const axios = require('axios')
const conf = require('../util/env');

/*
 * Special endpoint created for development purposes
 * Deletes all files and documents in databases.
 */

// Array which contains URIs for other microservices
const URIs = [
    conf.database_uri,
    conf.users_uri,
    conf.quotas_uri
]

router.get('/flushall', (req, res) => {
    
    URIs.forEach(uri => {

        axios.get(`${uri}/admin/flushall`).catch(err => {
            console.log(`Cannot comminicate with ${uri}.`)
        })

    })
    
    res.status(200).send('ALL FLUSHED')
})

module.exports = router;