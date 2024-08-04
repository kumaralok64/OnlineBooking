const mongoose = require('mongoose');

const User_Schema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
       unique:true
    },
    password:{
        type:String,
    },
    image:{
        type:String
    }
},{timestamps:true});


const User_Model = mongoose.model('User_Schemas',User_Schema);


module.exports = User_Model;