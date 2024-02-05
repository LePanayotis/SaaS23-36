const router = require('express').Router();
const quotasModel = require('../models/userQuotas');

/*
 * Administrative endpoints to erase mongo DB and healthcheck
 */

router.get('/flushall', async (req, res) => {
    try { 
        await quotasModel.deleteMany({});
        res.status(200).send("Flushed all");
    } catch (err) {
        res.status(500).send(err);
    }
})

router.get('/healthcheck', (req, res) => {
    res.json({
        Status: 200,
        Message: "Service quotas-management up and running"
    });
})


module.exports = router;