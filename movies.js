"use strict";

let cache = require("./cache.js");

const axios = require("axios");

function getMovies(cityMovie) {
  console.log('made it into getMovies');
  const key = 'movies-' + cityMovie;
  // console.log('query', request);
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${cityMovie}&language=en-US&page=1`;

  if (cache[key] && Date.now() - cache[key].timestamp < 3600000) {
    console.log("Movie cache hit");
  } else {
    console.log("Movie cache miss");
    cache[key] = {};
    cache[key].timestamp = Date.now();
    cache[key].data = axios
      .get(url)
      .then((movieResponse) => parseMovie(movieResponse.data));
  }
  console.log("cache", cache); 
  return cache[key].data;
}

function parseMovie(movieResponse) {
  try {
    const movieArray = movieResponse.results.map(movie => {
      return new Movie(movie);
    });
    return Promise.resolve(movieArray);
  } catch (e) {
    return Promise.reject(e);
  }
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
    this.timestamp = Date.now();
  }
}

module.exports = getMovies;




