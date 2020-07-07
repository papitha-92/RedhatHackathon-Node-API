const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv/config');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//import router
const carRoute = require('./routes/search');
//const filterRoute = require('./routes/filter');

//cors middleware
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    if(req.method==='OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});
    }
    next();
});

//middleware - to goto postRoute whenever there is /post
app.use('/car', carRoute);
//app.use('/car/filter', filterRoute);

app.use('/',(req, res) => {
    res.send("Root Node API")
})

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