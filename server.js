'use strict';

//imports
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const axios = require('axios'); 
//const weather = require('./weather');
const { response, query } = require('express');

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

app.get('/weather', getForecast); 
app.get('/movies', getMovies); 

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
async function getMovies (request, response, next) {
  const cityMovie = request.query.cityMovie;
  // console.log('query', request);
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${cityMovie}&language=en-US&page=1`;
  try{
    const movieResponse = await axios.get(url);
    console.log('testing', movieResponse.data.results);
    // console.log('movie results', movieResponse.data);
    const movieArray = movieResponse.data.results.map(movie => new Movie(movie));
    console.log('TEST MOVIE', movieArray[0]);
    response.status(200).send(movieArray);
  } catch (error) {
    console.log('am I running movies?');
    next(error);
  }
}

class Movie{
  constructor(obj){
    this.title = obj.title;
    this.overview = obj.overview;
    this.vote_average = obj.vote_average;
    this.vote_count = obj.vote_count;
    this.image_url = `https://image.tmdb.org/t/p/w500${obj.poster_path}`;
    this.popularity = obj.popularity;
    this.release_date = obj.release_date;
  }
}


app.use((error, request, response, next) => {
  //console.log(error);
  response.status(500).send(error);
});

app.listen(PORT, () => console.log(`listen on port ${PORT}`));
