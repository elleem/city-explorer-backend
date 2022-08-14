'use strict'; 

const axios = require('axios'); 

async function getForecast (request, response, next) {
  const {lat,lon} = request.query;
  // console.log('query', request);
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?days=5&units=I&lat=${lat}&lon=${lon}&key=${process.env.WEATHER_API_KEY}`; 
  try{
    const weatherResponse = await axios.get(url);
    console.log('results', weatherResponse.data);
    const weatherArray = weatherResponse.data.data.map(weather => new Forecast(weather));
    console.log('TEST', weatherArray);
    response.status(200).send(weatherArray);
  } catch (error) {
    console.log('am I running?');
    next(error);
  }
}

class Forecast {
  constructor(obj) {
    this.date = obj.datetime;
    this.description = 'Low of '+ obj.low_temp + ', High of ' + obj.high_temp + ' with ' + obj.weather.description.toLowerCase();
  }
}
module.exports = getForecast;
