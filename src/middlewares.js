"use strict";

const jwt = require('jsonwebtoken');

const config = require('./config').config;

const allowCrossDomain = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', '*');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.status(200).send(200);
    } else {
        next();
    }
};

const checkAuthentication = (req, res, next) => {

    // check header or url parameters or post parameters for token
    let token = "";
    if (req.headers.authorization) {
        const auth = req.headers.authorization.split(' ');
        if (auth[0] != 'Bearer') {
            return res.status(400).send({
                error: 'Bad request',
                message: 'Only accepting Bearer authorization. authorization header was not prefixed with Bearer'
            });
        } else {
            token = auth[1];
        }
    }

    if (!token)
        return res.status(401).send({
            error: 'Unauthorized',
            message: 'No token provided in the request'
        });

    // verifies secret and checks exp
    const secret = config.jwtSecret;
    jwt.verify(token, secret, (err, decoded) => {
        if (err) return res.status(401).send({
            error: 'Unauthorized',
            message: 'Failed to authenticate token.'
        });

        // if everything is good, save to request for use in other routes
        req.email = decoded.email;
        next();
    });


};

const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err)
    }
    res.status(500);
    res.render('error', {error: err})
};


module.exports = {
    allowCrossDomain,
    checkAuthentication,
    errorHandler
};