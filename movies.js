"use strict";

const axios = require("axios");

async function getMovies(request, response, next) {
  const cityMovie = request.query.cityMovie;
  // console.log('query', request);
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${cityMovie}&language=en-US&page=1`;
  axios
    .get(url)
    .then((movieResponse) => {
      console.log("testing", movieResponse.data.results);
      // console.log('movie results', movieResponse.data);
      const movieArray = movieResponse.data.results.map(
        (movie) => new Movie(movie)
      );
      console.log("TEST MOVIE", movieArray[0]);
      response.status(200).send(movieArray);
    })
    .catch((error) => {
      console.log("am I running movies?");
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
