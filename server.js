'use strict';

//imports
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const getForecast = require('./weather');
const getMovies = require('./movies');
const notFound = require('./notFound'); 
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

app.use((error, request, response, next) => {
  //console.log(error);
  response.status(500).send(error);
});

app.get('/weather', getForecast);
app.get('/movies', getMovies);

app.get('*',notFound);

app.listen(PORT, () => console.log(`listen on port ${PORT}`));
