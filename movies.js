'use strict';

let cache = require('./cache.js');

const axios = require('axios');

async function getMovies(request, response, next) {
  const cityMovie = request.query.cityMovie;
  // console.log('query', request);
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${cityMovie}&language=en-US&page=1`;
  axios
    .get(url)
    .then((movieResponse) => {
      // console.log('testing', movieResponse.data.results);
      // console.log('movie results', movieResponse.data);
      const movieArray = movieResponse.data.results.map(
        (movie) => new Movie(movie)
      );
      // console.log('TEST MOVIE', movieArray[0]);
      response.status(200).send(movieArray);
    })
    .catch((error) => {
      // console.log('am I running movies?');
      next(error);
    });
}

class Movie {
  constructor(obj) {
    this.title = obj.title;
    this.overview = obj.overview;
    this.vote_average = obj.vote_average;
    this.vote_count = obj.vote_count;
    this.image_url = `https://image.tmdb.org/t/p/w500${obj.poster_path}`;
    this.popularity = obj.popularity;
    this.release_date = obj.release_date;
  }
}

module.exports = getMovies;


// function getWeather(latitude, longitude) {
//   const key = 'weather-' + latitude + longitude;
//   const url = `http://api.weatherbit.io/v2.0/forecast/daily/?key=${WEATHER_API_KEY}&lang=en&lat=${lat}&lon=${lon}&days=5`;

//   if (cache[key] && (Date.now() - cache[key].timestamp < 50000)) {
//     console.log('Cache hit');
//   } else {
//     console.log('Cache miss');
//     cache[key] = {};
//     cache[key].timestamp = Date.now();
//     cache[key].data = axios.get(url)
//     .then(response => parseWeather(response.data));
//   }
  
//   return cache[key].data;
// }

// function parseWeather(weatherData) {
//   try {
//     const weatherSummaries = weatherData.data.map(day => {
//       return new Weather(day);
//     });
//     return Promise.resolve(weatherSummaries);
//   } catch (e) {
//     return Promise.reject(e);
//   }
// }

// class Weather {
//   constructor(day) {
//     this.forecast = day.weather.description;
//     this.time = day.datetime;
//   }
// }