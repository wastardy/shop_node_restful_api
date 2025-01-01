const express = require('express');
// app - екземпляр Express, який використовується 
// для налаштування маршрутизації, обробників 
// запитів і middleware.

/*  app - an Express instance used to configure 
    routing, request handlers, and middleware. */
const app = express();

// app.use() реєструє middleware, який виконується 
// для кожного запиту. У цьому випадку будь-який запит 
// до сервера відповість JSON-об'єктом

/*  app.use() registers the middleware being executed 
    for each request. In this case, any query 
    will respond to the server with a JSON object */
app.use((req, res, next) => {
    res.status(200).json({
        message: 'it works!'
    });
});

module.exports = app;