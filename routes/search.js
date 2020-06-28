const express = require('express');
const Car = require('../models/car');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', (req, res) => {
    //Car.find()
    const brand = req.body.brand;
    const city = req.body.city;
    const showroom = req.body.showroom;
    Car.aggregate([
        {
            $match: {
                brand: brand
            }
        },

        { $unwind: "$criteria" },

        { $match: 
            { "criteria.showroom": showroom } 
        },

        { $project: {
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
            const list = Object.values(doc).map(x => x.criteria.spec);
            console.log(JSON.stringify(list));
            res.status(200).json(list);
            //res.status(200).json(doc);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: err });
        });
});


router.get('/brand', (req, res) => {
    //Car.find()
    //Car.distinct("brand")
    //Car.distinct('brand', {'brand':{$exists:true}})
    //const  dist = Car.distinct("brands");
    //console.log(dist);
    Car.aggregate([
        /*{
            $group: {
              _id: "$brand"
            }
          },*/
        {
            $project: {
                _id: 0,
                "brand": 1
            }
        }
    ])
        .exec()
        .then(doc => {
            console.log(doc);
            const result={"brands":doc};
            //console.log(JSON.stringify(doc, ['brand']));
        res.send(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: err });
        });
});

router.get('/city', (req, res) => {
    //Car.find()
    const brand = req.body.brand;
    /*Car.aggregate([
        {
            $match: {
                brand: brand
            }
        },
        {
            $project: {
                _id: 0,
                "criteria.city": 1
            }
        }
    ])*/
    Car.distinct("criteria.city", { "brand": brand })
        .exec()
        .then(doc => {
            console.log(doc);
            const result={"cities":doc};
            //res.status(200).json(doc);
            res.send(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: err });
        });
});


router.get('/showroom', (req, res) => {
    //Car.find()
    const brand = req.body.brand;
    const city = req.body.city;
    Car.aggregate([
        {
            $match: {
                brand: brand
            }
        },
        { $unwind: "$criteria" },

        {
            $match: {
                "criteria.city": city
            }
        },
        {
            $project: {
                _id: 0,
                "criteria.showroom": 1
            }
        }
    ])
        .exec()
        .then(doc => {
            console.log(doc);
            const result={"showrooms":doc};
            console.log(result);
            const list = Object.values(doc).map(x => x.criteria.showroom);
            console.log(JSON.stringify(list));
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: err });
        });
});

/*router.post('/', (req, res, next) => {
    const test = new Test({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        company: req.body.company
    });
    test
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Record was created',
                Record: test
        })
        .catch(err => console.log(err));
        });
});*/

module.exports = router;

