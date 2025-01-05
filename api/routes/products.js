const express = require('express');
const router = express.Router();

// keep in mind that /products already is at the start of URL
router.get('/', (req, res, next) => {
    return res.status(200).json({
        message: 'handling GET request to /products'
    });
});

router.get('/:product_id', (req, res, next) => {
    const productId = req.params.product_id;

    if (productId === 'special') {
        return res.status(200).json({
            message: 'you discovered the special product ID', 
            id: productId
        });
    }
    else {
        return res.status(200).json({
            message: 'you passed a product ID'
        });
    }
});

router.post('/', (req, res, next) => {
    return res.status(201).json({
        message: 'handling POST request to /products'
    });
});

router.patch('/:product_id', (req, res, next) => {
    const productId = req.params.product_id;

    return res.status(200).json({
        message: 'update product', 
        id: productId
    });
});

router.delete('/:product_id', (req, res, next) => {
    const productId = req.params.product_id;

    return res.status(200).json({
        message: 'handling DELETE request for specific order', 
        id: productId
    });
});

module.exports = router;