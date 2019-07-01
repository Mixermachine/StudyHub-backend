"use strict";

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const config = require('../config').config;
const models = require('../models');


const login = (req, res) => {
    if (!Object.prototype.hasOwnProperty.call(req.body, 'password')) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body must contain a password property'
    });

    if (!Object.prototype.hasOwnProperty.call(req.body, 'email')) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body must contain a email property'
    });

    models.User.findOne({where: {email: req.body.email}})
        .then(user => {
            // check if the password is valid
            const isPasswordValid = bcrypt.compareSync(req.body.password, user.pwHash);
            if (!isPasswordValid) return res.status(401).send({token: null});

            // if user is found and password is valid
            // create a token
            const token = jwt.sign({id: user.id, email: user.email}, config.jwtSecret, {
                expiresIn: 86400 // expires in 24 hours
            });

            res.status(200).json({token: token})

        }).catch(reason => res.status(404).json({
        error: 'User not found',
        message: reason.message
    }));
};

const logout = (req, res) => {
    res.status(200).send({token: null});
};


module.exports = {
    login,
    logout,
};