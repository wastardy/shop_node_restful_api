const mongoose = require('mongoose');
const User = require('../models/User.js');
const bcrypt = require('bcrypt');
const handleError = require('../errorHandler.js');
const jwt = require('jsonwebtoken');

exports.sign_up = (req, res, next) => {
    // check if passed email for signup already exists
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            // user here is going to be an empty array
            // so i check is in array 1 or more emails like that
            if (user.length >= 1) {
                return res.status(409).json({
                    message: 'Mail already exists'
                });
            }
            else {
                // *password need to be hashed with node bcrypt js
                // npm install bcrypt
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    }
                    else {
                        // so if there's no any error, i just
                        // pass hashed password to password field
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });

                        // save user in DB
                        user.save()
                            .then(result => {
                                console.log(result);

                                return res.status(201).json({
                                    message: 'User created'
                                });
                            })
                            .catch(err => handleError(err, res));
                    }
                });
            }
        })
        .catch(err => handleError(err, res));
}

exports.log_in = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Authorization failed'
                });
            }

            const enteredPassword = req.body.password;
            const hash = user[0].password;
            const email = user[0].email;
            const userId = user[0]._id;

            bcrypt.compare(enteredPassword, hash, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Failed authorization',
                        error: err.message
                    });
                }

                if (result) {
                    const jwtToken = jwt.sign(
                        {
                            email_address: email, 
                            user_id: userId
                        }, 
                        process.env.JWT_KEY, 
                        {
                            expiresIn: "12h"
                        }
                    );

                    return res.status(200).json({
                        message: 'Authorization successfull',
                        token: jwtToken
                    });
                }

                res.status(401).json({
                    message: 'Failed authorization',
                    error: err
                });
            });
        })
        .catch(err => handleError(err, res));
}

exports.delete_particular_user = (req, res, next) => {
    const userId = req.params.user_id;

    User.deleteOne({ _id: userId })
        .exec()
        .then(result => {
            console.log(result);

            res.status(200).json({
                message: 'User has been deleted successfully'
            });
        })
        .catch(err => handleError(err, res));
}