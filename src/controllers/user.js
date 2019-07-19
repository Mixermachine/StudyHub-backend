"use strict";

const models = require('../models');
const env = process.env.NODE_ENV || 'development';
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const helper = require('./helper');
const logger = require('../logger.js')(__filename.split(/[\\/]/).slice(-2).join('/'));
const studyController = require('../controllers/study');

const create = async (req, res) => {
    if (Object.keys(req.body).length === 0) {
        logger.infoWithUuid(req, "Body empty");
        return res.status(400).json({
            error: 'Bad Request',
            message: 'The request body is empty'
        });
    }

    // all of this fields are mandatory
    const valuesDict = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        DoB: req.body.DoB,
        gender: req.body.gender,
        email: req.body.email,
        password: req.body.password
    };

    // Check if all fields are present
    // forEach can not break without exception
    let incomplete = false;
    Object.values(valuesDict).forEach(function (value) {
        if (value === undefined) {
            incomplete = true;
        }
    });

    // Return 400 and break if not all provided
    if (incomplete) {
        logger.infoWithUuid(req, "Not all fields provided");
        return helper.sendJsonResponse(res, 400, "Malformed request", "Not all fields provided");
    }

    // Check if email of new user already exists in database
    if (await models.User.count({where: {email: valuesDict['email']}})) {
        // Return conflict as email already exists
        logger.infoWithUuid(req, "Email address already exists in database");
        return helper.sendJsonResponse(res, 409, "Conflict", "Email address already exists in database");
    }

    // Set createdOn and modifiedOn fields
    valuesDict['createdOn'] = valuesDict['modifiedOn'] = Date.now();

    // Hash password and delete it from input
    valuesDict['pwHash'] = bcrypt.hashSync(valuesDict['password'], saltRounds);
    delete valuesDict['password'];

    // Add new user into database
    models.User.create(valuesDict)
        .then(x => {
            if (x) {
                logger.infoWithUuid(req, "Created user " + valuesDict['email']);
                res.status(200).json({id: x.id});
            }
        })
        .catch(error => {
            logger.errorWithUuid(req, error);
            helper.sendJsonResponse(res, 500, "Internal server error",
                env === 'development' ? error.message : "Request failed")
        });
};

const get = async (req, res) => {
    let id = req.params.id;
    if (id === undefined) {
        id = req.id;  // get id from caller
    }

    if (id !== req.id) {
        logger.infoWithUuid(req, "User unauthorized");
        return helper.sendJsonResponse(res, 401, "Unauthorized",
            "You can not access user data of other users");
    }

    models.User.findByPk(id, {
        attributes: ['id', 'firstName', 'lastName', 'DoB', 'gender', 'email', 'createdOn', 'modifiedOn']
    }).then(user => {
        if (!user) {
            logger.infoWithUuid(req, "Id " + id + " not found");
            return helper.sendJsonResponse(res, 404, "Not found",
                "User with id " + id + " was not found")
        }

        // email should only be visible to user who is logged in
        if (!(req.auth && req.id === user.id)) {
            user.email = user.createdOn = user.modifiedOn = "hidden";
        }

        logger.infoWithUuid(req, "User " + id + " returned");
        res.status(200).json(user);
    });
};

const put = async (req, res) => {
    const id = req.params.id;

    if (id === undefined) {
        logger.infoWithUuid(req, "Id not provided");
        return helper.sendJsonResponse(res, 422, "Parameter id is missing",
            "Can't find user without the id");
    }

    if (Object.keys(req.body).length === 0) {
        logger.infoWithUuid(req, "Body empty");
        return res.status(400).json({
            error: 'Bad Request',
            message: 'The request body is empty'
        });
    }

    // all fields are optional but one must be specified
    const valuesDict = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        DoB: req.body.DoB,
        gender: req.body.gender,
        email: req.body.email,
        password: req.body.password
    };

    // check authentication
    if (!(req.auth && req.id == id)) {
        logger.infoWithUuid(req, "req.id " + req.id + " was declined access to " + id);
        return helper.sendJsonResponse(res, 401, "Authentication error",
            "You must be logged in to change your user data");
    }

    // check if email already exists
    if (valuesDict['email'] !== undefined) {
        // Check if changed email already exists in database
        if (await models.User.count({where: {email: valuesDict['email']}})) {
            // Return conflict as email already exists
            logger.infoWithUuid(req, "conflicting email " + valuesDict['email']);
            return helper.sendJsonResponse(res, 409, "Conflict", "Email address already exists in database");
        }
    }


    // Set modifiedOn field
    valuesDict['modifiedOn'] = Date.now();

    // hash password
    if (valuesDict['password'] !== undefined) {
        // Hash password and delete it from input
        valuesDict['pwHash'] = bcrypt.hashSync(valuesDict['password'], saltRounds);
        delete valuesDict['password'];
    }

    // build update
    Object.keys(valuesDict).forEach(key => {
        if (valuesDict[key] === undefined) {
            delete valuesDict[key];
        }
    });

    // update fields
    models.User.update(valuesDict, {where: {id: id}})
        .then(x => {
            if (x) {
                logger.infoWithUuid(req, "user " + id + " was updated");
                res.status(200).send()
            }
        })
        .catch(error => {
            logger.errorWithUuid(req, error);
            helper.sendJsonResponse(res, 500, "Internal server error",
                env === 'development' ? error.message : "Request failed")
        });
};

const getAppliedStudies = (req, res) => {
    const userId = req.params.userId;
    if (userId === undefined) {
        return helper.sendJsonResponse(res, 422, "Parameter id is missing",
            "Can't get applied studies for user without user id");
    }

    if (parseInt(userId) !== req.id) {
        return helper.sendJsonResponse(res, 401, "Unauthorized",
            "You can not access user data of other users");
    }

    models.Timeslot.findAll( {
        where: {participantId: userId},
        attributes: ['studyId', 'participantId', 'start', 'stop', 'attended', 'payoutMethodId'],
        include: [{model: models.Study, attributes: ['id', 'title', 'description', 'prerequisites', 'capacity', 'country', 'city', 'zip', 'street', 'number',
                'additionalLocationInfo', 'rewardCurrency', 'rewardAmount', 'published']}]
    }).then(result => {
        res.status(200).json(result);
    });
};

const getCreatedStudies = (req, res) => {
    const userId = req.params.userId;
    if (userId === undefined) {
        return helper.sendJsonResponse(res, 422, "Parameter id is missing",
            "Can't get applied studies for user without user id");
    }

    if (parseInt(userId) !== req.id) {
        return helper.sendJsonResponse(res, 401, "Unauthorized",
            "You can not access user data of other users");
    }

    models.Study.findAll( {
        where: {creatorId: userId},
        attributes: ['id', 'title', 'description', 'prerequisites', 'capacity', 'country', 'city', 'zip', 'street', 'number',
            'additionalLocationInfo', 'rewardCurrency', 'rewardAmount', 'published', 'creatorId', 'payeeId']
    }).then(results => {
        if (results) {
            studyController.addDurationAndCapacityAndReturn(res, results);
        }
    });
};


module.exports = {
    create,
    get,
    put,
    getAppliedStudies,
    getCreatedStudies
};