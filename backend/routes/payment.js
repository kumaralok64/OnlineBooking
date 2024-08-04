const express = require('express');
const {paymentController} = require('../controllers/payment');
const {Details} = require('../Middlewares/User');
const Paymentroutes = express.Router();

Paymentroutes.post('/checkOut',paymentController);


module.exports = Paymentroutes;

