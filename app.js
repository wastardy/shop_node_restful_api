const express = require('express');

/*  app - an Express instance used to configure 
    routing, request handlers, and middleware. */
const app = express();
const morgan = require('morgan');

const productRoutes = require('./api/routes/products.js');
const orderRoutes = require('./api/routes/orders.js');

/*  app.use() registers the middleware being executed 
    for each request. In this case, any query 
    will respond to the server with a JSON object */

/* app.use() simple check
    app.use((req, res, next) => {
    res.status(200).json({
        message: 'it works!'
    });
}); */

// log incoming requests
app.use(morgan('dev'));


// ===> Routes which should handle requests <===
/*  anything starter from '/products' in the URL
    will be forwarded to ./api/routes/products.js */
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// this route will be reached ONLY if previous routes
// weren't able to handle the request
app.use((req, res, next) => {
    const error = new Error('not foud any correct route');
    error.status = 404;
    next(error)
});

// handle any error thrown by the application
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;