const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        // console.log(token);

        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.user_data = decoded;
        next();
    }
    catch(error) {
        console.error(error.message);

        return res.status(401).json({
            message: 'Authorization failed'
        });
    }
};