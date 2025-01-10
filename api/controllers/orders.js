const mongoose = require('mongoose');
const Order = require('../models/Order.js');
const Product = require('../models/Product.js');
const handleError = require('../errorHandler.js');

exports.get_all_orders = (req, res, next) => {
    Order.find()
        .select('product quantity _id')
        .populate('product', 'name') // its like "I need only product name!!"
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
        .catch(err => handleError(err, res));
}

exports.get_particular_order = (req, res, next) => {
    const orderId = req.params.order_id;

    Order.findById(orderId)
        // here i remove 'name' constraint because
        // i need all the data about product
        .populate('product') 
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
        .catch(err => handleError(err, res));
}

exports.create_new_order = (req, res, next) => {
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
        .catch(err => handleError(err, res));
}

exports.delete_particular_order = (req, res, next) => {
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
        .catch(err => handleError(err, res));
}