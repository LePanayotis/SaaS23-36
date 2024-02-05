const fs = require('fs');
const csv = require('csv-parser');



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
              borderColor: [],
              backgroundColor: [],
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
          datasets[index].borderColor.push(row[borderColourlabel] || 'blue')
          datasets[index].backgroundColor.push(row[backgroundColourlabel] || '#0000ff44');
          
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

