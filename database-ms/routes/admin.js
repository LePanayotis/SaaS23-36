const router = require('express').Router();
const Chart = require('../models/chart.js')
const fs = require('fs');
const path = require('path');


/*
 * Administrative endpoint that clears all documents in mongo database
 * and clears directories where thumbnails and csvs are stored.
 */
router.get('/flushall', async (req, res) => {
    try {

        //Clear all documents
        Chart.deleteMany({}).catch((err)=>{ console.log(err.message) });

        //Set directories names
        const directoryCSV = path.join(__dirname, '..', 'csv');
        const directoryThumbnails = path.join(__dirname, '..', 'thumbnails');
        
        //Clear all csv files
        fs.readdir(directoryCSV, (err, files) => {
            if (err) throw err;

            for (const file of files) {
                fs.unlink(path.join(directoryCSV, file), (err) => {
                    if (err) throw err;
                });
            }
        });

        //Clear all thmubnails
        fs.readdir(directoryThumbnails, (err, files) => {
            if (err) throw err;

            for (const file of files) {
                fs.unlink(path.join(directoryThumbnails, file), (err) => {
                    if (err) throw err;
                });
            }
        });

        res.status(200).send('All charts cleared');

    } catch (err) {
        console.log(err.message);
        res.status(500).json(err.message);
    }
})


router.get('/healthcheck', (req, res) => {
    res.status(200).send('OK')
})


module.exports = router;