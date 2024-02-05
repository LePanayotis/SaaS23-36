const fs = require('fs');
const multer = require('multer');
const { auth } = require('../middleware/auth');
const FormData = require('form-data');
const path = require('path');
const axios = require('axios');
const router = require('express').Router();
const conf = require('../util/env.js');
const upload = multer({ dest: 'uploads/' });

const database_uri = conf.database_uri
const quotasURI = conf.quotas_uri; // send to db ms


// Function used to determine the URI of the corresponding microservice
// of each chart type.

function chartGenerator(type) {
    switch (type) {
        case ('polar-area'):
            return conf.polar_area_uri
            break;
        case ('scatter'):
            return conf.scatter_uri
            break;
        case ('bubble'):
            return conf.bubble_uri
            break;
        case ('radar'):
            return conf.radar_uri
            break;
        case ('stacked-bar'):
            return conf.stacked_bar_uri
            break;
        case ('line'):
            return conf.line_uri;
            break;
    }
    return undefined;
}


// Implements the download of the requested chart , according to parameters:
// Chart type, File format, chartId and authorisation token. Needs authorisation
router.get('/download/:type/:format/:chartId', auth, async (req, res) => {

    //Gets params
    const type = req.params.type;
    const format = req.params.format;
    const chartId = req.params.chartId;

    //Params must be all defined
    if (format && type && chartId) {

        //Finds corresponding chart creation microservice
        const chart_microservice = chartGenerator(type);

        //Sets the path where the chart will be temporarily stored, until the user gets it.
        const tempPath = path.join(__dirname, 'uploads', '..', `${chartId}.${format}`);
        const requestURI = `${chart_microservice}/getChart/${format}/${chartId}`;

        try {
            // Gets the chart in the requested file format from the chart generator microservice
            // The chartId must be provided for the microservice to ask the CSV from the database microservice
            const { data } = await axios.get(requestURI, { responseType: 'stream' });

            res.setHeader('Content-Disposition', `attachment; filename="${chartId}.${format}"`);

            // Stores stream in tempPath
            data.pipe(res).on('finish', () => {
                    // Deletes when file is send to user
            }).on('error', () => {
                res.status(500).send('Error in downloading file');
            });
        } catch (err) {
            res.status(500).send('Error in downloading file, axios error');
        }
    } else {
        res.status(400).send('Bad Request');
    }

})

// Checks if user has enough remaining quotas
// Needs authorisation
router.get('/checkQuotas', auth, async (req, res) => {
    const googleId = req.googleId;
    const url = `${quotasURI}/quotas-api/getQuotas/${googleId}`;
    try {
        const { data } = await axios.get(url);
        const quotas = data.quotas.quotas;
        if (Number(quotas) > 0) {
            res.json({ ok: true, quotas: quotas });
        } else {
            res.json({ ok: false, quotas: quotas });
        }
    } catch (err) {
        res.status(500).send('Error in checking quotas');
    }
})


// Sends request to database microservice to erase chart with chartId
// Needs authorisation
router.delete('/deleteChart/:chartId', auth, async (req, res) => {

    // Gets chartId and googleId
    const googleId = req.googleId;
    const chartId = req.params.chartId;
    // Creates request url
    const url = `${database_uri}/deleteChart/${googleId}/${chartId}`;
    try {
        // Send delete request to database-ms
        await axios.delete(url);
        res.send('Chart deleted successfully');
    } catch (err) {
        res.status(500).send('Error in deleting chart');
    }
})


/*
 * Endpoint to add & store a new chart to database microservice.
 * Performs use of quota using quotas microservice
 * Uses CSV file created by /generateChart endpoint
 * Needs authorisation 
 */
router.post('/upload/:type/:chartCSV/:chartName', auth, async (req, res) => {
    // Retreives needed parameters
    const type = req.params.type;
    const chartName = req.params.chartName;
    const googleId = req.googleId;
    const chartCSV = req.params.chartCSV;

    // Creates formData to forward to database microservice
    const formData = new FormData();

    // Makes urls and paths
    const url = `${database_uri}/storeChart/${type}/${googleId}/${chartName}`;
    const csvPath = path.join(__dirname, '..', 'uploads', chartCSV);
    const imgPath = path.join(__dirname, '..', 'public', 'temp_imgs', `${chartCSV}.jpg`);

    try {
        // Reads CSV and appends to form
        const fileData = fs.readFileSync(csvPath);
        formData.append('file', fileData, chartCSV);
    } catch (err) {

        res.status(500).send('Error in reading file');

    }

    // Updates quotas of user with googleId in quotas microservice
    axios.put(`${quotasURI}/quotas-api/use/${googleId}/1`)
        .catch(err => {
            console.log('Error using quotas', err.message);
            res.status(500).send('Error using quotas');
        });

    // After successful quotas update creates the post request with the form data
    // If successful, the chart is finally added to database microservice
    axios.post(url, formData, {
        headers: formData.getHeaders()
    }).then(result => {
        // Deletes files from frontend-orchestrator
        fs.unlinkSync(csvPath);
        fs.unlinkSync(imgPath);
        res.status(200).send('File uploaded successfully')

    }).catch(err => {
        // In case of error deletes created files from frontend-orchestrator
        if (fs.existsSync(csvPath)) fs.unlinkSync(csvPath);
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
        res.status(500).send('Error in uploading file');

    })
})

/*
 * Used when the user rejects the preview of a generated chart and they don't wish
 * to add it in thei charts collection
 * Needs authorisation
 */
router.delete('/rejectChart/:chartCSV', auth, async (req, res) => {
    const chartCSV = req.params.chartCSV
    const csvPath = path.join(__dirname, '..', 'uploads', chartCSV);
    const imgPath = path.join(__dirname, '..', 'public', 'temp_imgs', `${chartCSV}.jpg`);
    try {
        fs.unlinkSync(csvPath);
        fs.unlinkSync(imgPath);
        res.send('Chart rejected')
    } catch (err) {
        res.status(500).send('Error in deleting', err.message);
    }
})


/* API endpoint used to generate chart preview based on a provided CSV file
 * The CSV file, stored locally, is forwarded to the corresponding chart microservice to be produced
 * A thumbnail is returned and stored temporarilly locally.
 * Needs authorisation
 */

router.post('/generateChart', auth, upload.single('file'), async (req, res) => {

    // Get parameters from body
    const type = req.body.type;
    const file = req.file;

    // Form data for the CSV to be forwarded to the chart microservice
    const formData = new FormData();

    // Sets the chart microservice according to chart type
    const url = chartGenerator(type);

    try {

        // Adds CSV file to formData to be forwarded to charts microservice
        const fileData = fs.readFileSync(file.path);
        formData.append('file', fileData, file.originalname);

    } catch (err) {
        // In case of error deletes stored locally CSV file
        fs.unlinkSync(file.path);
        res.status(500).send('Error in reading file');
    }

    try {
        // Gets thumbnail and stores it in /public/temp_imgs in jpg format
        const { data } = await axios.post(`${url}/getThumbnail`, formData, {
            headers: formData.getHeaders(),
            responseType: 'stream'
        })

        const imgPath = path.join(__dirname, '..', 'public', 'temp_imgs', `${file.filename}.jpg`)
        data.pipe(fs.createWriteStream(imgPath));

        //Returns the preview url, the chart type and the imgId which is the filename created by multer
        res.json({
            preview: `/public/temp_imgs/${file.filename}.jpg`,
            imgId: file.filename,
            type: type
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

// Forwards buy quotas request to quotas microservice
// Needs authorisation

router.put('/buyquotas/:quantity', auth, async (req, res) => {
    // Retrieves params
    const quantity = req.params.quantity;
    const googleId = req.googleId;
    try {
        // Request to quotas microservice
        const { data } = await axios.put(`${quotasURI}/quotas-api/add/${googleId}/${quantity}`);
        res.json({ quotas: data.quotas });

    } catch (err) {
        res.status(500).send('Error in buying quotas');
    }
})

module.exports = router;