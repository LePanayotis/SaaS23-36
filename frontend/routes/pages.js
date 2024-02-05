const { auth } = require('../middleware/auth');
const axios = require('axios');
const router = require('express').Router();
const conf = require('../util/env');

//Failed authentication endpoint
router.get('/auth_failed', (req, res) => {
    res.status(404).render('error', { error: 'Authentication failed' });
})

//Home page endpoint
router.get('/', (req, res) => {
    res.render('home');
})

//Buy quotas page, needs authorisation
router.get('/buyquotas', auth, async (req, res) => {
    try {

        //Retrieves user information to render to page (username, email and image url)
        const token = req.cookies['token'];
        const userInfo = (await axios.get(`${conf.users_uri}/user-api/getUser/${token}`)).data;

        //Renders page with retrieved user information
        res.render('buyquotas', { email: userInfo.email, image: userInfo.image, name: userInfo.firstName });

    } catch (err) {
        console.log(err.message);
        res.redirect('/');
    }
})

//Create charts page, needs authorisation
router.get('/createChart', auth, async (req, res) => {
    try {

        //Retrieves user information to render to page (username, email and image url)
        const token = req.cookies['token'];
        const userInfo = (await axios.get(`${conf.users_uri}/user-api/getUser/${token}`)).data;

        //Renders page with retrieved user information
        res.render('create', { email: userInfo.email, image: userInfo.image, name: userInfo.firstName });

    } catch (err) {
        console.log(err.message);
        res.redirect('/');
    }

})

//Enpoint to present table with all the user's charts
router.get('/dashboard', auth, async (req, res) => {
    try {

        //Gets the token value from cookies
        const token = req.cookies['token'];

        //Gets the user's info from users microservice
        const userInfo = (await axios.get(`${conf.users_uri}/user-api/getUser/${token}`)).data;
        const googleId = userInfo.googleId;

        // Get's the user's charts from database-microservice
        const userData = (await axios.get(`${conf.database_uri}/getCharts/${googleId}`)).data;


        let charts = [];
        //For each chart in the user data, 
        userData.forEach((chart) => {
            charts.push({
                chartId: chart.chartId,
                type: chart.type,
                createdAt: stringToDate(chart.createdAt),
                thumbnail: chart.thumbnail,
                chartName: chart.chartName || 'no-name'
            })
        })

        //Render dashboard with collected info & data
        res.render('dashboard', { email: userInfo.email, image: userInfo.image, charts: charts, name: userInfo.firstName });
    } catch (err) {
        console.log(err.message);
        res.redirect('/');
    }


})

// Turns a provided ISO date string to mm/dd/yyyy hh:mm string using local time
function stringToDate(dateString) {

    const date = new Date(dateString);

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day}/${month}/${year} ${hours}h${minutes}`;

}

// Account information endoint, needs authorisation
router.get('/account', auth, async (req, res) => {
    //Retreives all user information from users and quotas microservices
    const token = req.cookies['token'];
    const googleId = req.googleId;

    try {
        //User information from users microservice
        const userInfo = (await axios.get(`${conf.users_uri}/user-api/getUser/${token}`)).data;

        //Remaining quotas from quotas microservice
        const quotas = (await axios.get(`${conf.quotas_uri}/quotas-api/getQuotas/${googleId}`)).data.quotas.quotas;

        //Turns ISO date string to dd/mm/yyy hh:mm
        const dateString = userInfo.createdAt;
        const formattedDate = stringToDate(dateString)

        //Renders template with info
        res.render('account', { email: userInfo.email, image: userInfo.image, name: userInfo.firstName, surname: userInfo.lastName, createdAt: formattedDate, quotas: quotas });
    } catch (err) {
        res.status(500).send("Unable to get user info");
    }

})

// Logout endpoint, clears cookies from the browser
// and redirects to home page
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
})



module.exports = router;