'use strict';

//imports
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const weather = require('./weather');
const movies= require('./movies');
const notFound = require('./notFound');

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

app.use((error, request, response, next) => {
  //console.log(error);
  response.status(500).send(error);
});

app.get('/weather', getForecast);
app.get('/movies', getMovies);

app.get('*', notFound);

function getForecast(request, response) {
  const { lat, lon } = request.query;
  weather(lat, lon)
    .then((summaries) => response.send(summaries))
    .catch((error) => {
      console.error(error);
      response.status(500).send('Sorry. Something went wrong!');
    });
}

function getMovies(request, response) {
  const cityMovie = request.query.cityMovie;
  movies(cityMovie)
    .then((summaries) => response.send(summaries))
    .catch((error) => {
      console.error(error);
      response.status(500).send('Sorry. Something went wrong!');
    });
}

app.listen(PORT, () => console.log(`listen on port ${PORT}`));
