const https = require('https');

function helloThere() {
  console.log("General Kenobi! You're a bold one.");
}
function dummyDataSync() {
  return { title: "I'm Dummy Data" };
}
async function dummyData() {
  return { title: "I'm Async Dummy Data" };
}
function gitHubData() {
  return new Promise(function(resolve,reject) {
    const request = https.get(
      'https://api.github.com/users/profstolley',
      { headers: { 'User-Agent': 'wx-station'} },
      function(res) {
        let rawData = [];
        res.on('data', function(d) {
          rawData.push(d);
        });
        res.on('end', function() {
          resolve(JSON.parse(rawData.join('')));
        });
      });
      request.on('error', function(err) {
        reject(err);
      });
  });
}

module.exports = {
  helloThere,
  dummyDataSync,
  dummyData,
  gitHubData
}
