const mongoose = require('mongoose');

const screeningSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true
  },
  time: [
    {
      type: String,
      required: true,
    }
  ]
});

const movieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  screenings: [screeningSchema] 
}, { timestamps: true });

module.exports = movieSchema;
