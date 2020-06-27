const express = require('express');
const mongoose = require('mongoose');
const Test = require('../models/test');
const router = express.Router();


router.get('/', (req, res) => {
    Test.find()
    .exec()
    .then(doc =>{
        console.log(doc);
        res.json(doc);
    })
    .catch (err =>
        {
        console.log(err);
        res.json({ message: err });
    });
});

router.post('/', (req, res, next) => {
    const test = new Test({
        _id :mongoose.Types.ObjectId(),
        name : req.body.name,
        company : req.body.company
    });
    test
    .save()
    .then(result =>{
        console.log(result);
        res.json(result);
    })
    .catch (err =>
        {
        console.log(err);
        res.json({ message: err });
    });
});

module.exports = router;

