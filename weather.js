'use strict';
let cache = require('./cache.js');

const axios = require('axios');

// async 
function getForecast(lat,lon) {
  console.log('made it into getForecast');
  const key = 'weather-'+ lat+ lon; 
  // console.log('query', request);
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?days=5&units=I&lat=${lat}&lon=${lon}&key=${process.env.WEATHER_API_KEY}`;
  if (cache[key] && (Date.now() - cache[key].timestamp < 50000)) {
    console.log('Cache hit', key);
  } else {
    console.log('Cache miss');
    cache[key] = {};
    cache[key].timestamp = Date.now();
    cache[key].data = axios.get(url)
      .then(weatherResponse => parseWeather(weatherResponse.data));
  }
  return cache[key].data;
}
//   axios
//     .get(url)
//     .then((weatherResponse) => {
//       console.log('results', weatherResponse.data);
//       const weatherArray = weatherResponse.data.data.map(
//         (weather) => new Forecast(weather)
//       );
//       console.log('TEST', weatherArray);
//       response.status(200).send(weatherArray);
//     })
//     .catch((error) => {
//       next(error);
//       console.log('am I running?');
//     });
// }

function parseWeather(weatherResponse) {
  try {
    const weatherArray = weatherResponse.data.map(weather => {
      return new Forecast(weather);
    });
    return Promise.resolve(weatherArray);
  } catch (error) {
    return Promise.reject(error);
  }
}

class Forecast {
  constructor(obj) {
    this.date = obj.datetime;
    this.description =
      'Low of ' +
      obj.low_temp +
      ', High of ' +
      obj.high_temp +
      ' with ' +
      obj.weather.description.toLowerCase();
  }
}
module.exports = getForecast;
