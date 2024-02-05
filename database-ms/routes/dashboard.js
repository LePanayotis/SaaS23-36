const router = require('express').Router();
const Chart = require('../models/chart.js')
const fs = require('fs');
const  thumbnail_URL = require('../util/env.js').thumbnail_uri;


// Returns all charts associated to user with provided googleId in params
router.get('/getCharts/:googleId', async (req, res) => {
    
    const googleId = req.params.googleId;

    try{
        // Finds all charts of user with googleId 
        const charts = await Chart.find({ googleId: googleId },{createdAt: 1, chartId:1 , type: 1, chartName: 1});
        
        //Adds to each json object the thumbnail url
        for(let chart of charts ){
            chart.thumbnail = thumbnail_URL + '/thumbnails/' + chart.chartId + '.jpg';
        }

        // Sends json object with charts
        res.json(charts)
    } catch (err) {

        console.log(err.message)
        res.status(500).send(err.message)
    }
    
})


// Deletes a specific chart from database and file system
// provided googleId and chartdId
router.delete('/deleteChart/:googleId/:chartId', async (req, res) => {
    
    const googleId = req.params.googleId;
    const chartId = req.params.chartId;

    try{
        // Performs delete in mongo
        await Chart.findOneAndDelete({ googleId: googleId, chartId: chartId })
        
        // Unlinks CSV and Thumbnai in file system
        fs.unlinkSync('csv/' + chartId);
        fs.unlinkSync('thumbnails/' + chartId + '.jpg');

    } catch (err) {
        console.log(err.message)
        res.status(500).send(err.message)
    }
    
})

module.exports = router;