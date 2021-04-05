// Import modules
const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const compression = require('compression');

// Config PORT
const PORT = 3000;

// Init Express
const app = express();

// Install middleware
app.use(logger('dev'));
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve assets in public directory statically
app.use(express.static('public'));

// Establish database connection
mongoose.connect('mongodb://localhost/budget', {
  useNewUrlParser: true,
  useFindAndModify: false,
});

// Import API routes
app.use(require('./routes/api.js'));

// Start listening
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
