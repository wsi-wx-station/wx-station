'use strict';
const fs = require('fs').promises;

async function writeWeatherData(file, data) {
  await fs.writeFile(file, JSON.stringify(data))
    .then(function(){
      console.log('Weather data written to file');
    })
    .catch(function(e){
      console.error(e);
    });
}

module.exports = { writeWeatherData };
