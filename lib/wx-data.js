
'use strict';
const https = require('https');

function gitHubData() {
  return new Promise(function(resolve, reject) {
    const request = https.get('https://api.github.com/users/profstolley',
      { headers: {'User-Agent': 'wx-station'}},
      function(res) {
        let rawdata = [];
        // console.log(res.headers);
        res.on('data', function(data) {
          rawdata.push(data);
        });
        res.on('end', function() {
          resolve(JSON.parse(rawdata.join('')));
        });
      });
    request.on('error', function(err) {
      reject(err);
    });
  });
}

async function returnDummyData() {
  return { title: "It's async data, Dummy. From the library." };
}

function returnDummyDataSync() {
  return { title: "It's sync data, Dummy. From the library." };
}

module.exports = {
  gitHubData,
  returnDummyData,
  returnDummyDataSync
};
