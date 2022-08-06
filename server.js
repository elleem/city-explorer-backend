"use strict";

//imports
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const weather = require("./data/weather.json");

//server
const app = express();

//middleware
app.use(cors());

//server coord
const PORT = process.env.PORT || 3002;

//home route
app.get("/", (request, response) => {
  response.send("test");
});

//three parameters here
app.get("/weather", (request, response) => {
  //const {lat,lon} = request.query;
  const searchQuery = request.query.searchQuery;
  console.log("query", request.query);
  //console.log('query', request.query.searchQuery);
  // console.log ('lat/lon', {lat,lon});
  //console.log(citySearch);
  const weatherForecast = new Forecast(searchQuery); 
  const forecastSearch = weatherForecast.weatherSearch(); 
  response.send(forecastSearch);
});



class Forecast {
  constructor(searchQuery) {
    let { datetime, description } = weather.find(
      (forecast) => forecast.city_name.toLowerCase === searchQuery
    );
    this.date = datetime;
    this.description = description;
  }



weatherSearch() {
  return this.description.map(weather=> ({
    description: weather.description,
    date: weather.datetime
  })); 
}

app.listen(PORT, console.log(`listen on port ${PORT}`));
