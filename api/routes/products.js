const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/Product.js');

// keep in mind that /products already is at the start of URL
router.get('/', (req, res, next) => {
    Product.find()
        .exec()
        .then(docs => {
            console.log(docs);

            // if (docs.length >= 0) {
            //     res.status(200).json(docs)
            // }
            // else {
            //     res.status(404).json({
            //         message: 'No entries found'
            //     });
            // }

            res.status(200).json(docs);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.get('/:product_id', (req, res, next) => {
    const productId = req.params.product_id;

    Product.findById(productId).exec()
        .then(document => {
            console.log(`===> from db: ${document}`);

            if (document) {
                res.status(200).json(document);
            }
            else {
                res.status(404).json({
                    message: 'No valid entry found for provided ID'
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err})
        });
});

router.post('/', (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name, 
        price: req.body.price
    });

    // mongoose method, store my object in DB
    product.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'handling POST request to /products',
                createdProduct: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.patch('/:product_id', (req, res, next) => {
    const productId = req.params.product_id;
    const updateOptions = {};

    for (const option of req.body) {
        updateOptions[option.prop_name] = option.value;
    }

    Product.update({ _id: productId }, { $set: updateOptions })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.delete('/:product_id', (req, res, next) => {
    const productId = req.params.product_id;

    Product.deleteOne({ _id: productId })
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;