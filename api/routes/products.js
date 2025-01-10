const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/Product.js');
const multer = require('multer');

const fs = require('fs');
const path = './uploads/';

if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, path); 
    },
    filename: function(req, file, callback) {
        const uniqueSuffix = 
            new Date()
            .toISOString()
            .replace(/:/g, '-') 
            + file.originalname;

        callback(null, uniqueSuffix);
    }
});

const fileFilter = (req, file, callback) => {
    if (file.mimetype === 'image/jpeg' 
        || file.mimetype === 'image/jpg'
        || file.mimetype === 'image/png') {
        
        // accept a file
        callback(null, true);
    }
    else {
        // reject a file
        callback(null, false);
    }
};

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // only accept 5 mb files
    }, 
    fileFilter: fileFilter
});

// keep in mind that /products already is at the start of URL
router.get('/', (req, res, next) => {
    Product.find()
        .select('name price _id product_image')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length, 
                products: docs.map(product => {
                    return {
                        name: product.name, 
                        price: product.price,
                        product_image: product.product_image,
                        _id: product._id,
                        request: {
                            type: 'GET', 
                            url: 'http://localhost:3000/products/' + product._id
                        }
                    };
                })
            };

            res.status(200).json(docs);
        })
        .catch(err => handleError(err, res));
});

router.get('/:product_id', (req, res, next) => {
    const productId = req.params.product_id;

    Product.findById(productId)
        .select('name price _id product_image')
        .exec()
        .then(doc => {
            console.log(`===> from db: ${doc}`);

            if (doc) {
                res.status(200).json({
                    product: doc, 
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products'
                    }
                });
            }
            else {
                res.status(404).json({
                    message: 'No valid entry found for provided ID'
                });
            }
        })
        .catch(err => handleError(err, res));
});

router.post('/', upload.single('product_image'), (req, res, next) => {
    // console.log(req.file);

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name, 
        price: req.body.price,
        product_image: req.file.path
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
        .catch(err => handleError(err, res));
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
        .catch(err => handleError(err, res));
});

router.delete('/:product_id', (req, res, next) => {
    const productId = req.params.product_id;

    Product.deleteOne({ _id: productId })
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => handleError(err, res));
});

module.exports = router;