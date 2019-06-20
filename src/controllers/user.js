const jwt = require('jsonwebtoken');
const models = require('../models');
const env = process.env.NODE_ENV || 'development';
const bcrypt = require('bcryptjs');
const saltRounds = 10;

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
        email: req.body.email,
        password: req.body.password
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

    valuesDict['createdOn'] = valuesDict['modifiedOn'] = Date.now();

    bcrypt.hash(valuesDict['password'], saltRounds).then(
        value => {
            valuesDict['pwHash'] = value;
            delete valuesDict['password'];
        })
        .then(() => {
            models.User.create(valuesDict)
                .then(res.status(200).send())
                .catch(error => res.status(500).json({
                    error: 'Internal server error',
                    message: env === 'development' ? error.message : "Request failed"
                }))
        })
        .catch(reason => console.log(reason));
};

module.exports = {
    create
};