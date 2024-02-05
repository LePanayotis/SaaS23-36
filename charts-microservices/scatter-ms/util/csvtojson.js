const fs = require('fs');
const csv = require('csv-parser');

async function csvToJson(csvFilePath) {
  return new Promise((resolve, reject) => {
    const datasets = [];
    const extra = {};
    const datasetLabels = [];
    let yLabel;
    let xLabel;
    let firstLabel;
    let borderColourlabel;
    let backgroundColourlabel;
    let counter = 0;

    fs.createReadStream(csvFilePath)
      .pipe(csv({ separator: ';' }))
      .on('data', (row) => {
        try{
          if(counter === 0) {
            xLabel = Object.keys(row)[1];
            yLabel = Object.keys(row)[2];
            firstLabel = Object.keys(row)[0];
            backgroundColourlabel = Object.keys(row)[3];
            borderColourlabel = Object.keys(row)[4];
            extra.title = row[Object.keys(row)[5]];
          }

          const datasetName = row[firstLabel]
          if (!datasetLabels.includes(datasetName)){
            datasetLabels.push(datasetName);
            datasets.push({
              label: datasetName,
              data: [],
              borderColor: row[borderColourlabel] || '#aa0000',
              backgroundColor: row[backgroundColourlabel] || '#0000aa',
            })
          }
          let index = datasetLabels.findIndex((temp) => temp === datasetName)
          

          let x = Number.parseFloat(row[xLabel].replace(',', '.'))
          let y = Number.parseFloat(row[yLabel].replace(',','.'))

          if(y === undefined || isNaN(y) || isNaN(x) || x === undefined) {
            reject('CSV file corrupt');
          }

          datasets[index].data.push({
            x:x,y:y
          })
          counter++;
        } catch(err) {
          console.log(err);
          reject('Check CSV first')
        }
      })
      .on('end', () => {
        resolve(
          {
            ready: { datasets },
            options: extra
          });
      })
      .on('error', (error) => {
        console.log('Houston, problem');
        reject(error);
      })
  })
}
module.exports = csvToJson;