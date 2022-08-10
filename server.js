'use strict';

//imports
const express = require('express');
const cors = require('cors');
require('dotenv').config();
//const axios = require('axios'); 
const weather = require('./data/weather.json');
const { response } = require('express');

//server
const app = express();

//middleware
app.use(cors());

//server coord
const PORT = process.env.PORT || 3002;

//home route
app.get('/', (request, response) => {
  response.send('test');
});

//three parameters here
app.get('/weather', (request, response, next) => {
  try {
    //const {lat,lon} = request.query;
    const searchQuery = request.query.searchQuery;
    console.log('query', request.query);
    const weatherForecast = new Forecast(searchQuery);
    const forecastSearch = weatherForecast.weatherSearch();
    response.status(200).send(forecastSearch);
  } catch (error) {
    next(error);
  }
});

class Forecast {
  constructor(searchQuery) {
    const cityData = weather.find(
      (forecast) =>
        forecast.city_name.toLowerCase() === searchQuery.toLowerCase()
    );
    console.log(cityData);
    this.city = cityData;
  }
  weatherSearch() {
    return this.city.data.map((weather) => ({
      description: weather.weather.description,
      date: weather.datetime,
    }));
  }
}

app.use((error, request, response, next) => {
  //console.log(error);
  response.status(500).send(error);
});

app.listen(PORT, () => console.log(`listen on port ${PORT}`));
