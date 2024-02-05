const router = require('express').Router();
const quotasModel = require('../models/userQuotas');

const defaultQuotas = 5;


// Gets quotas on the mongo for user with googleId
router.get('/getQuotas/:googleId', async (req, res) => {
    const googleId = req.params.googleId;
    try {
        // Finds quotas on the mongo
        const quotas = await quotasModel.findOne({ googleId: googleId });
        
        if (quotas) {
            // There's an entry in the collection
            res.status(200).json({ quotas: quotas });
        } else {
            // There's no entry in the collection
            res.status(404).json({ Status: 404, Message: "User not found" });
        }
    } catch (err) {
        res.status(500).json({ Status: 500, Message: "Internal Server Error" });
    }
})

// Adds new user with gratis quotas in the mongo 
router.post('/newUser', async (req, res) => {
    try {
        // Gets info
        const googleId = req.body.googleId;
        const quotas = req.body.quotas || defaultQuotas;

        // Creates and store object according to model
        await quotasModel.create({ googleId: googleId, quotas: quotas })

        // Success
        res.json({ Status: 200, Message: `User ${googleId} added successfully with quotas ${quotas}` })
    } catch (err) {
        if (err.code === 11000) {
            // Error in case of duplicat entry in DB
            console.log('Duplicate entry in DB');
            res.status(400).json({ Status: 400, Message: `User ${googleId} already exists in DB` });
        } else {
            // Other errors
            console.log('Error in adding new user', err.message);
            res.status(500).json({ Status: 500, Message: err.message });
        }
    }
});


// Adds quotas to existing user
router.put('/add/:googleId/:units', async (req, res) => {
    // Manages params
    const googleId = req.params.googleId;
    const units = Number(req.params.units) || 1;
    try {
        // Checks for existing user quotas
        const quotas = await quotasModel.findOne({ googleId: googleId });
        // Increases quotas by units
        const newQuotas = quotas.quotas + units;
        // Performs update
        await quotasModel.updateOne({ googleId: googleId }, { $set: { quotas: newQuotas } });
        // Responds
        res.status(200).send({
            googleId: quotas.googleId,
            quotas: newQuotas
        })
    } catch (err) {
        // General error in adding quotas
        console.log('Error in adding quotas to user', err.message);
        res.status(500).json({ Status: 500, Message: err.message });
    }
})


// Decreases the number of quotas of a user
router.put('/use/:googleId/:units', async (req, res) => {
    // Manages params
    const googleId = req.params.googleId;
    const units = Number(req.params.units) || 1; // default is 1 quota
    try {
        // Gets remaining quotas
        const quotasLeft = await quotasModel.findOne({ googleId: googleId });
        // Checks if user has enough
        if (quotasLeft.quotas >= units) {
            const left = Number(quotasLeft.quotas) - units;
            // Updates decreased quotas
            await quotasModel.updateOne({ googleId: googleId }, { $set: { quotas: left } });
            // Success
            res.json({ Status: 200, output: true, Message: `Used ${units} quota of user ${googleId}, ${left} more left.` });
        } else {
            // Not enough quotas
            res.json({ Status: 400, output: false, Message: `You want to consume ${units} quota of user ${googleId}, howerver ${quotasLeft.quotas} are left.` })
        }

    } catch (err) {
        // General error
        console.log('Error in comsuming quotas', err.message);
        res.status(500).json({ Status: 500, Message: err.message });
    }


})


module.exports = router;