const models = require('../models');
const env = process.env.NODE_ENV || 'development';
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const logger = require('./../logger');
const helper = require('./helper');

const create = async (req, res) => {
    if (Object.keys(req.body).length === 0) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body is empty'
    });

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
        helper.sendJsonResponse(res, 400, "Malformed request", "Not all fields provided");
        return;
    }

    // Check if email of new user already exists in database
    if (await models.User.count({where: {email: valuesDict['email']}})) {
        // Return conflict as email already exists
        helper.sendJsonResponse(res, 409, "Conflict", "Email address already exists in database");
        return;
    }

    // Set createdOn and modifiedOn fields
    valuesDict['createdOn'] = valuesDict['modifiedOn'] = Date.now();

    // Hash password and delete it from input
    valuesDict['pwHash'] = bcrypt.hashSync(valuesDict['password'], saltRounds);
    delete valuesDict['password'];

    // Add new user into database
    models.User.create(valuesDict)
        .then(res.status(200).send())
        .catch(error => helper.sendJsonResponse(res, 500, "Internal server error",
            env === 'development' ? error.message : "Request failed"));

    logger.info("Created user " + valuesDict['email']);
};

const get = async (req, res) => {
    const id = req.params.id;
    if (id === undefined) {
        return helper.sendJsonResponse(res, 422, "Parameter id is missing",
            "Can't find user without the id");
    }

    models.User.findByPk(id, {
        attributes: ['id', 'firstName', 'lastName', 'DoB', 'gender', 'email', 'createdOn', 'modifiedOn']
    }).then(user => {
        if (!user) {
            return helper.sendJsonResponse(res, 404, "Not found",
                "User with id " + id + " was not found")
        }

        // email should only be visible to user who is logged in
        if (!(req.auth && req.id === user.id)) {
            user.email = user.createdOn = user.modifiedOn = "hidden";
        }

        res.status(200).json(user);
    });
};

const put = async (req, res) => {
    if (Object.keys(req.body).length === 0) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body is empty'
    });

    // only id is mandatory
    const id  = req.body.id;
    const valuesDict = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        DoB: req.body.DoB,
        gender: req.body.gender,
        email: req.body.email,
        password: req.body.password
    };

    if (id === undefined) {
        return helper.sendJsonResponse(res, 422, "Parameter id is missing",
            "Can't find user without the id");
    }

    // check authentication
    if (!(req.auth && req.id == id)) {
        return helper.sendJsonResponse(res, 401, "Authentication error",
            "You must be logged in to change your user data");
    }

    // check if email already exists
    if (valuesDict['email'] !== undefined) {
        // Check if changed email already exists in database
        if (await models.User.count({where: {email: valuesDict['email']}})) {
            // Return conflict as email already exists
            helper.sendJsonResponse(res, 409, "Conflict", "Email address already exists in database");
            return;
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
    models.User.update(valuesDict, {where:{id:id}})
        .then(res.status(200).send())
        .catch(error => helper.sendJsonResponse(res, 500, "Internal server error",
            env === 'development' ? error.message : "Request failed"));

    logger.info("User with id " + id + " updated");
};

module.exports = {
    create,
    get,
    put
};