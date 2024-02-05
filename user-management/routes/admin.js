const router = require('express').Router();
const users = require('../models/users');
const tempUsers = require('../models/tempUsers');

/*
 * Administrative endpoints to erase mongo DB and healthcheck
 */

router.get('/flushall', async (req, res) => {
    try {
        await tempUsers.deleteMany({})
        await users.deleteMany({})
        res.send('Users flushed')
    } catch (err) {
        res.status(500).send('Error flushing users');

    }
})

router.get('/healthcheck', (req, res) => {
    res.json({
        Status: 200,
        Message: "User management service is up and running"
    })
})

module.exports = router;