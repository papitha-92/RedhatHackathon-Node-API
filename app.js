const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv/config');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//import router
const carRoute = require('./routes/search');
const filterRoute = require('./routes/filter');

//middleware - to goto postRoute whenever there is /post
app.use('/car/search', carRoute);
app.use('/car/filter', filterRoute);

//open mongod connection
mongoose.connect(process.env.DB_CONNECTION, {useNewUrlParser : true}).
then(()=>
{
    console.log("Connection to DB is successful");
})
.catch(err =>{
    console.log("Unable to connect with DB");
});

app.listen(3000);