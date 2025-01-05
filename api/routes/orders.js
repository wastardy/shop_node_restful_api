const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    return res.status(200).json({
        message: 'orders were fetched'
    });
});

router.get('/:order_id', (req, res, next) => {
    const orderId = req.params.order_id;

    return res.status(200).json({
        message: 'particular order details', 
        orderId: orderId
    });
});

router.post('/', (req, res, next) => {
    return res.status(201).json({
        message: 'a new order was created'
    });
});

router.delete('/:order_id', (req, res, next) => {
    const orderId = req.params.order_id;
    
    return res.status(200).json({
        message: 'particular order deleted', 
        id: orderId
    }); 
});

module.exports = router;