const router = require('express').Router();
const Chart = require('../models/chart.js')
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const upload = multer({ dest: 'csv/' });
const conf = require('../util/env.js');


// Return uri of corresponding chart microservice according to type
function chartServerPort(type) {
    switch (type) {
        case ('polar-area'):
            return conf.polar_area_uri
            break;
        case ('scatter'):
            return conf.scatter_uri
            break;
        case('bubble'):
            return conf.bubble_uri
            break;
        case('radar'):
            return conf.radar_uri
            break;
        case('stacked-bar'):
            return conf.stacked_bar_uri
            break;
        case('line'):
            return conf.line_uri;
            break;
    }
    return undefined;
}


/*
 * Returns the CSV file of the chart with chartId provided in params
 * The name of the CSV file is the chartId and it is stored in the csv directory
 */
router.get('/getCSV/:chartId', async (req, res) => {
    
    const chartId = req.params.chartId;
    const absPathCSV = path.join(__dirname, '..', 'csv', `${chartId}`);
    
    if (fs.existsSync(absPathCSV)) {
        const fileStream = fs.createReadStream(absPathCSV);
        fileStream.pipe(res)
    } else {
        res.status(404).send('Chart CSV not found');
    }


})


/*
 * Endpoint use to add a provided chart object in the database
 * The CSV file is stored in the CSV directory and gets a random filename 
 * from the mutler middleware. This name is used as the chartId
*/
router.post('/storeChart/:type/:googleId/:chartName', upload.single('file'), async (req, res) => {

    const file = req.file;
    const googleId = req.params.googleId;
    const chartName = req.params.chartName
    const type = req.params.type;
    const imgPath = path.join(__dirname,'..','thumbnails', `${file.filename}.jpg`);
    const formData = new FormData();

    // Constructs form data and appends the provided csv file
    try {
        const fileData = fs.readFileSync(file.path);
        formData.append('file', fileData, file.originalname);
    } catch (err) {
        return res.status(500).json(err.message);
    }

    // Form data is forwarded to chart microservice to produce thumbnail
    
    try {
        // Sends form data to chart microservice, response type is stream.
        const { data } = await axios.post(`${chartServerPort(type)}/getThumbnail`, formData, {
            headers: formData.getHeaders(),
            responseType: 'stream'
        })

        // Writes the stream containg the thumbnail 
        data.pipe(fs.createWriteStream(imgPath));
        await Chart.create({ googleId: googleId, csv: file.path, type: type, thumbnail: imgPath, chartId: file.filename, chartName: chartName});
        res.send("Chart uploaded successfully");

    } catch (err) {

        //In case of error deletes created files and documents from mongo
        if( fs.existsSync(imgPath) ) fs.unlink(imgPath);
        if( fs.existsSync(file.path)) fs.unlink(file.path);
        try{
            await Chart.findOneAndDelete({ googleId: googleId, chartId: file.filename })
        } finally {
            console.log(err.message);
            res.status(500).json(err.message);
        }
    }
})


module.exports = router;