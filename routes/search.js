const express = require('express');
const Car = require('../models/car');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/search', (req, res) => {
    const brand = req.body.brand;
    const city = req.body.city;
    const showroom = req.body.showroom;
    console.log(brand);
    Car.aggregate([
        {
            $match: {
                brand: brand
            }
        },
        { $unwind: "$criteria" 
        },
        {
            $match:
                { "criteria.showroom": showroom }
        },
        { $unwind: "$criteria.spec" 
        },
        {
            $project: {
               "criteria.spec.model": 1,
                "criteria.spec.color": 1,
                "criteria.spec.price": 1,
                "criteria.spec.stock": 1,
                /*"model": "$criteria.spec.model",
                "color": "$criteria.spec.color",
                "price": "$criteria.spec.price",
                "stock": "$criteria.spec.stock",*/
                "_id": 0
            }
        }
    ])
        .exec()
        .then(doc => {
            console.log(doc);
            var specJson=[];
            for (let i = 0; i < doc.length; i++) {
                let temp = doc[i].criteria.spec;
                console.log("temp"+temp);
                specJson.push({ "spec": temp });
                console.log(specJson);
            }
            console.log(specJson);
            const result = { "specs": specJson };
            console.log(result);
            res.send(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: err });
        });
});

router.get('/brand', (req, res) => {
    Car.distinct("brand")
        .exec()
        .then(doc => {
            console.log("doc " + doc);
            var brandJson = [];
            for (let i = 0; i < doc.length; i++) {
                let temp = doc[i];
                console.log(temp);
                brandJson.push({ "brand": temp });
                console.log(brandJson);
            }
            console.log(brandJson);
            const result = { "brands": brandJson };
            console.log(result);
            res.send(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: err });
        });
});

router.get('/city', (req, res) => {
    const brand = req.body.brand;
    Car.distinct("criteria.city", { "brand": brand })
        .exec()
        .then(doc => {
            console.log("doc " + doc);
            var cityJson = [];
            for (let i = 0; i < doc.length; i++) {
                let temp = doc[i];
                console.log(temp);
                cityJson.push({ "city": temp });
                console.log(cityJson);
            }
            console.log(cityJson);
            const result = { "cities": cityJson };
            console.log(result);
            res.send(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: err });
        });
});

router.get('/showroom', (req, res) => {
    const brand = req.body.brand;
    const city = req.body.city;
    Car.aggregate([
        {
            $match: {
                brand: brand
            }
        },
        { $unwind: "$criteria" 
        },
        {
            $match: {
                "criteria.city": city
            }
        },
        {
            $project: {
                _id: 0,
                'showroom': '$criteria.showroom'
            }
        }
    ])
        .exec()
        .then(doc => {
            console.log(doc);
            const result = { "showrooms": doc };
            console.log(result);
            res.send(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: err });
        });
});

router.get('/filter', (req, res) => {
    const brand = req.body.brand;
    const city = req.body.city;
    const showroom = req.body.showroom;
    console.log("brand : "+ brand+"...city : "+city+"...showroom : "+showroom);

    const model = req.body.model;
    const color = req.body.color;
    console.log("model : "+ model+"...color : "+color);

    const pricemin = req.body.pricemin;
    const pricemax = req.body.pricemax;
    console.log("pricemin : "+ pricemin+"...pricemax : "+pricemax);

    Car.aggregate([
        {
            $match: {
                "brand": brand
            }
        },
        { $unwind: "$criteria" 
        },
        {
            $match:
                { "criteria.showroom": showroom}
        },
        { $unwind: "$criteria.spec" 
        },
        {
            $match:
            {
            "$and":[
                {"criteria.spec.model":{ $in: model }},
                {"criteria.spec.color":{ $in: color }},
                {"criteria.spec.price":{ $gte: pricemin, $lte: pricemax }}
              ]
            }
        },
        {
            $project: {
               "criteria.spec.model": 1,
                "criteria.spec.color": 1,
                "criteria.spec.price": 1,
                "criteria.spec.stock": 1,
                "_id": 0
            }
        }
    ])
    .exec()
    .then(doc => {
        console.log(doc);
        //res.send(doc);
        var specJson=[];
            for (let i = 0; i < doc.length; i++) {
                let temp = doc[i].criteria.spec;
                console.log("temp"+temp);
                specJson.push({ "spec": temp });
                console.log(specJson);
            }
            console.log(specJson);
            const result = { "specs": specJson };
            console.log(result);
            res.send(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ message: err });
    });

});

module.exports = router;

