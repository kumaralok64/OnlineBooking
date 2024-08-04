const mongoose = require('mongoose');

const Seat_schema = new mongoose.Schema({
    row:{
        type:Number
    },
    col:{
        type:Number
    },
    status:{
        type:String
    },
    Available:{
        type:Boolean
    }
})


module.exports = Seat_schema