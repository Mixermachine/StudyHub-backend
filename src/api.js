"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const middlewares = require('./middlewares');
const logger = require('./logger').getContextLogger("rest_collecter");

const auth = require('./routes/auth');
const user = require('./routes/user');
const study = require('./routes/study');

const swaggerDoc = require('./swaggerDoc');

const api = express();


// Adding Basic Middlewares
api.use(helmet());
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({extended: false}));
api.use(middlewares.allowCrossDomain);


// Basic route
api.get('/', (req, res) => {
    res.json({
        name: 'SEBA Master Movie Backend'
    });
});

// API logger
api.use(logger.logRestCall);

// API routes
api.use('/auth', auth);
api.use('/user', user);
api.use('/study', study);

// finally, setup swagger
swaggerDoc(api);

module.exports = api;