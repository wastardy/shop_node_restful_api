const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User.js');
const bcrypt = require('bcrypt');

router.post('/signup', (req, res, next) => {
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
                            .catch(err => {
                                console.log(err.message);

                                return res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        })
        .catch();
});

module.exports = router;