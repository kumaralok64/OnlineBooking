const express = require("express");
const Hallroutes = express.Router();
const {handleUpdatedeatils,handlepushHallData,handlehalldetails,handleHallRegis} = require('../controllers/HallDetails');
Hallroutes.post("/Regis-hall",handleHallRegis);
Hallroutes.post("/Update-Hall",handleUpdatedeatils);
Hallroutes.post('/push-Halldata' ,handlepushHallData);
Hallroutes.get('/halls/:movieName',handlehalldetails);

module.exports = Hallroutes;