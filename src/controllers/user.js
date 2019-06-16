const jwt = require('jsonwebtoken');
const models = require('../models');
const env = process.env.NODE_ENV || 'development';

const create = (req, res) => {
    if (Object.keys(req.body).length === 0) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body is empty'
    });

    const valuesDict = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        DoB: req.body.DoB,
        gender: req.body.gender,
        email: req.body.email
    };

    // forEach can not break without exception
    let incomplete = false;
    Object.values(valuesDict).forEach(function (value) {
        if (value === undefined) {
            incomplete = true;
        }
    });

    if (incomplete) {
        res.status(501).json({
            error: 'Internal server error',
            message: "Not all fields provided"
        }).send();

        return;
    }

    models.User.create(valuesDict)
        .then(res.status(200).send())
        .catch(error => res.status(500).json({
            error: 'Internal server error',
            message: env === 'development' ? error.message : "Request failed"
        }));
};

module.exports = {
    create
};