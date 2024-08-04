const mongoose = require('mongoose');
const Seat_schema = require('./Seat');
const movie_schema = require('./Movie')
const Hall_schema = new mongoose.Schema(
    {
           name:{
            type:String
           },
           location:{
            type:String
           },
           seats:[Seat_schema],
           movie:[movie_schema]
    },{timestamps:true}
)
const Hall_model = mongoose.model("Hall_schema",Hall_schema);

module.exports = Hall_model;