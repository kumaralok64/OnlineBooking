const mongoose = require('mongoose');

async function ConnectionTOdb(url){

     return mongoose.connect(url);
}

module.exports = { ConnectionTOdb};