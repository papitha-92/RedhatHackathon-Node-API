const mongoose = require('mongoose');
const carSchema = mongoose.Schema({
brand:  String ,
criteria: [{
       city:  String,
       showroom:  String,
       spec:[{
           model: String,
           color: String,
           price: Number,
           stock: Number,
       }] 
    }]
});

module.exports = mongoose.model('Car', carSchema);