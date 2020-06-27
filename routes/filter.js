const express = require('express');
const Car = require('../models/car');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', (req, res) => {
    const brand = req.body.brand;
    const city = req.body.city;
    const showroom = req.body.showroom;
    const price = req.body.price;
    const model= req.body.model;
    const color= req.body.color;
    Car.distinct("brand")
        .exec()
        .then(doc => {
            console.log(doc);
            res.status(200).json(doc);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: err });
        });
});

module.exports = router;