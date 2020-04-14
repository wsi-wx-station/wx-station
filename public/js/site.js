if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
  .then(function(registration) {
    console.log('Registered a service worker scoped to', registration.scope)
  })
  .catch(function(error) {
    console.error('Failed to register service worker', error)
  });
}

var socket = io.connect('http://localhost:3001');
socket.on('news', function(data){
  console.log(data.greet);
  socket.emit('backactcha', { dude: "I am socketed up, brah"});
});
socket.on('weather', function(data) {
  var date = document.querySelector('#date');
  var tempf = document.querySelector('#tempf');
  var winddir = document.querySelector('#winddir');
  var windspeedmph = document.querySelector('#windspeedmph');

  date.innerText = shortDate(data.date);
  date.dateTime = data.date;
  tempf.innerText = data.tempf;
  winddir.innerText = cardinalDirection(data.winddir);
  winddir.dataset.winddir = data.winddir;
  windspeedmph.innerText = data.windspeedmph;

});

function zeroPad(num,length = 2) {
  num = num.toString();
  while (num.length < length) {
    num = '0' + num;
  }
  return num
}

function shortDate(d) {
  d = new Date(d);
  return `${d.getMonth()+1}/${d.getDate()} ${d.getHours()}:${zeroPad(d.getMinutes())}`;
}

function cardinalDirection(deg) {
  var cardinals = [
    'N',
    'NNE',
    'NE',
    'ENE',
    'E',
    'ESE',
    'SE',
    'SSE',
    'S',
    'SSW',
    'SW',
    'WSW',
    'W',
    'WNW',
    'NW',
    'NNW',
    'N'
  ];
  return cardinals[Math.round(deg / 22.5)];
}
