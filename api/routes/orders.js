const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/Order.js');
const Product = require('../models/Product.js');

router.get('/', (req, res, next) => {
    Order.find()
        .select('product quantity _id')
        .exec()
        .then(docs => {
            console.log('\n===> Fetched ORDERS data from db:\n', docs);
            
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id, 
                        product: doc.product, 
                        quantity: doc.quantity,
                        request: {
                            type: 'GET', 
                            url: 'http://localhost:3000/orders/' + doc._id
                        }
                    }
                })
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.get('/:order_id', (req, res, next) => {
    const orderId = req.params.order_id;

    Order.findById(orderId)
        .exec()
        .then(order => {
            if (!order) {
                return res.status(404).json({
                    message: 'order not found'
                });
            }

            console.log('\n===> Fetched order by id:\n', order);

            if (order) {
                res.status(200).json({
                    order: order,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + order._id
                    }
                });
            }
            else {
                res.status(404).json({
                    message: `There's no any order with the specified ID`
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.post('/', (req, res, next) => {
    Product.findById(req.body.product_id)
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: 'product not found'
                });
            }

            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                product: req.body.product_id,
                quantity: req.body.quantity
            });
        
            return order.save()
                .then(result => {
                    console.log(result);
                    res.status(201).json({
                        message: 'Order stored',
                        createdOrder: {
                            _id: result._id,
                            product: {
                                _id: product._id,
                                name: product.name,
                                price: product.price
                            },
                            quantity: result.quantity
                        },
                        request: {
                            type: 'POST',
                            url: 'http://localhost:3000/orders/' + result._id
                        }
                    });
                });
        })
        .catch(err => {
            console.log('Error saving order:', err);
            res.status(500).json({
                error: err.message
            });
        });
});

router.delete('/:order_id', (req, res, next) => {
    const orderId = req.params.order_id;
    
    Order.deleteOne({ _id: orderId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Order deleted',
                request: {
                    type: 'DELETE',
                    url: 'http://localhost:3000/orders/' + result._id,
                    body: {
                        productId: 'ID',
                        quantity: 'number'
                    }
                }
            });
        })
        .catch(err => {
            console.log('Error deleting order:', err);
            res.status(500).json({
                error: err.message
            });
        });
});

module.exports = router;