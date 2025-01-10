const express = require('express');

/*  app - an Express instance used to configure 
    routing, request handlers, and middleware. */
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products.js');
const orderRoutes = require('./api/routes/orders.js');
const userRoutes = require('./api/routes/user.js');

/*  app.use() registers the middleware being executed 
    for each request. In this case, any query 
    will respond to the server with a JSON object */

/* app.use() simple check
    app.use((req, res, next) => {
    res.status(200).json({
        message: 'it works!'
    });
}); */

mongoose.connect(
    'mongodb+srv://wastardy:' + 
    process.env.MONGO_ATLAS_PW + 
    '@cluster0.rti1n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    // {
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true
    // }
);

// Listen for the connection events
mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB successfully');
});

mongoose.connection.on('error', (err) => {
    console.log('Error connecting to MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Disconnected from MongoDB');
});

// Close the connection when the app is terminated
process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('MongoDB connection closed due to app termination');
        process.exit(0);
    });
});

// log incoming requests (logger)
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    extended: false
}));
//extract json data and makes it easy to read
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // acces to every client

    res.header(
        'Access-Control-Allow-Headers', 
        'Origin, X-Requested-Width, Content-Type, Accept, Authorization'    
    );

    // browser ask *can he does any requests
    if (req.method === 'OPTIONS') {
        res.header(
            'Access-Control-Allow-Methods', 
            'GET, PUT, POST, PATCH, DELETE'
        );

        return res.status(200).json({});
    }

    next();
});


// ===> Routes which should handle requests <===
/*  anything starter from '/products' in the URL
    will be forwarded to ./api/routes/products.js */
app.use('/products', productRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

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