"use strict";

const jwt = require('jsonwebtoken');

const config = require('./config').config;

const allowCrossDomain = (req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'authorization, origin, x-requested-with, content-type, accept');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.status(200).send(200);
    } else {
        next();
    }
};

const checkAuthentication = (req, res, next) => innerCheckAuthentication(req, res, next, true);
const checkAuthenticationOptional = (req, res, next) => innerCheckAuthentication(req, res, next, false);

const innerCheckAuthentication = (req, res, next, sendError) => {
    req.auth = false;

    // check header or url parameters or post parameters for token
    let token = "";
    if (req.headers.authorization) {
        const auth = req.headers.authorization.split(' ');
        if (auth[0] !== 'Bearer') {
            if (sendError) {
                return res.status(400).send({
                    error: 'Bad request',
                    message: 'Only accepting Bearer authorization. authorization header was not prefixed with Bearer'
                });
            } else {
                next();
                return
            }

        } else {
            token = auth[1];
        }
    }

    if (!token)
        if (sendError) {
            return res.status(401).send({
                error: 'Unauthorized',
                message: 'No token provided in the request'
            });
        } else {
            next();
            return
        }


    // verifies secret and checks exp
    const secret = config.jwtSecret;
    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            if (sendError) {
                return res.status(401).send({
                    error: 'Unauthorized',
                    message: 'Failed to authenticate token.'
                });
            } else {
                next();
                return
            }
        }

        // if everything is good, save to request for use in other routes
        req.auth = true;
        req.id = decoded.id;
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
    checkAuthenticationOptional,
    errorHandler
};