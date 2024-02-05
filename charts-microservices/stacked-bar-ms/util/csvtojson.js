const fs = require('fs');
const csv = require('csv-parser');

// const backgroundColor = [
//   'rgba(162, 70, 127, 0.35)',
//   'rgba(155, 190, 79, 0.35)',
//   'rgba(40, 105, 50, 0.35)',
//   'rgba(32, 98, 219, 0.35)',
//   'rgba(74, 201, 183, 0.35)',
//   'rgba(202, 143, 61, 0.35)',
//   'rgba(156, 243, 121, 0.35)',
//   'rgba(112, 26, 175, 0.35)',
//   'rgba(165, 191, 222, 0.35)',
//   'rgba(29, 145, 137, 0.35)',
//   'rgba(108, 166, 39, 0.35)',
//   'rgba(220, 159, 29, 0.35)'
// ]

async function csvToJson(csvFilePath) {
  return new Promise((resolve, reject) => {
    const datasets = [];
    const extra = {};
    const datasetLabels = [];

    let labels = [];
    
    let xLabel;
    let datasetLabel;
    let valueLabel;

    let borderColourlabel;
    let backgroundColourlabel;
    let counter = 0;

    fs.createReadStream(csvFilePath)
      .pipe(csv({ separator: ';' }))
      .on('data', (row) => {
        try{
          if(counter === 0) {
            datasetLabel = Object.keys(row)[1];
            valueLabel = Object.keys(row)[2];
            xLabel = Object.keys(row)[0];
            backgroundColourlabel = Object.keys(row)[3];
            borderColourlabel = Object.keys(row)[4];
            extra.title = row[Object.keys(row)[5]];
          }

          const datasetName = row[datasetLabel]
          if (!datasetLabels.includes(datasetName)){
            datasetLabels.push(datasetName);
            datasets.push({
              label: datasetName,
              data: [],
              borderColor: row[borderColourlabel] || '#ff000055',
              backgroundColor: row[backgroundColourlabel] || '#0000ff55',
            })
          }

          const label = row[xLabel];
          if(!labels.includes(label)){
            labels.push(label);
          }

          let index = datasetLabels.findIndex((temp) => temp === datasetName)
          let numValue = Number.parseFloat(row[valueLabel].replace(',','.'));


          if(numValue === undefined || isNaN(numValue) ) {
            reject('CSV file corrupt');
          }

          datasets[index].data.push(numValue);
          
          counter++;
        } catch(err) {
          console.log(err);
          reject('Check CSV first')
        }
      })
      .on('end', () => {
        resolve(
          {
            ready: { labels, datasets },
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

