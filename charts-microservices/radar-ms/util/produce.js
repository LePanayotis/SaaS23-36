const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const path = require('path');
const csvtojson = require(path.join(__dirname, 'csvtojson.js'));
const fs = require('fs');


const width = 1080;
const height =  720;
// Chart.js configuration

async function setConfigurations(csvpath){
    let data;
    try{
        data = await csvtojson(csvpath);
    } catch (err) {
        throw new Error('Could not parse chart')
    }
    const configuration = {
        type: 'radar',
        data: data.ready,
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: data.options.title
                }
            }
        }

    };
    const backgroundColour = 'white';

    return { configuration , backgroundColour};
}

async function producejpg(csvpath, destpath) {

    const {configuration, backgroundColour} = await setConfigurations(csvpath);

    const canvas = new ChartJSNodeCanvas({ width: width, height: height, backgroundColour: backgroundColour});

    const image = await canvas.renderToBufferSync(configuration, 'image/png');

    fs.writeFileSync(destpath, image);
}

async function producehtml(csvpath, destpath) {
    const {configuration, backgroundColour} = await setConfigurations(csvpath);
    const canvas = new ChartJSNodeCanvas({type:'svg', width: width, height: height, backgroundColour });

    const image = await canvas.renderToBufferSync(configuration, 'image/svg+xml');

    fs.writeFileSync(destpath, image);
}

async function producesvg(csvpath, destpath) {

    const {configuration, backgroundColour} = await setConfigurations(csvpath);

    const canvas = new ChartJSNodeCanvas({type:'svg', width: width, height: height, backgroundColour });

    const image = await canvas.renderToBufferSync(configuration, 'image/svg+xml');

    fs.writeFileSync(destpath, image);
}

async function producepdf(csvpath, destpath) {

    const {configuration, backgroundColour} = await setConfigurations(csvpath);

    const canvas = new ChartJSNodeCanvas({type:'pdf', width: width, height: height, backgroundColour });

    const image = await canvas.renderToBufferSync(configuration, 'application/pdf');

    fs.writeFileSync(destpath, image);
}


async function produceThumbnail(csvpath, thumbnailPath) {

    const {configuration, backgroundColour} = await setConfigurations(csvpath);

    const canvas = new ChartJSNodeCanvas({ width: 600, height: 400, backgroundColour });

    const image = canvas.renderToBufferSync(configuration, 'image/jpeg');

    fs.writeFileSync(thumbnailPath, image);
}

module.exports = { producejpg, producehtml, producesvg, producepdf, produceThumbnail };