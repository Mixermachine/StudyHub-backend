"use strict";

const models = require('../models');
const env = process.env.NODE_ENV || 'development';
const logger = require('./../logger');
const helper = require('./helper');
const creator = require('./creator');
const payee = require('./payee');

const get = (req, res) => {
    const studyId = req.params.studyId;
    if (studyId === undefined) {
        return helper.sendJsonResponse(res, 422, "Parameter id is missing",
            "Can't get details for a study without the id of the study");
    }

    models.Study.findByPk(studyId, {
        attributes: ['title', 'description', 'prerequisites', 'capacity', 'country', 'city', 'zip', 'street', 'number',
            'additionalLocationInfo', 'published', 'creatorId', 'payeeId']
    }).then(study => {
        if (!study || !study.published) {
            return helper.sendJsonResponse(res, 404, "Not found",
                "Study with id " + studyId + " was not found")
        }

        // creator and payee should only be visible to these two
        if (!(req.auth && (req.id === study.creatorId || req.id === study.payeeId))) {
            study.creatorId = study.payeeId = "hidden";
        }

        res.status(200).json(study);
    });
};

const post = async (req, res) => {
    // check if user is creator already
    if (!(await creator.isCreator(req.id))) {
        return helper.sendJsonResponse(res, 403, "User is not creator",
            "To create a study a user has to be a creator. Make user creator first.");
    }

    // all of this fields are mandatory
    const valuesDict = {
        title: req.body.title,
        description: req.body.description,
        prerequisites: req.body.prerequisites,
        capacity: req.body.capacity,
        country: req.body.country,
        city: req.body.city,
        zip: req.body.zip,
        street: req.body.street,
        number: req.body.number,
        published: req.body.published,
        payeeId: req.body.payeeId
    };

    // Check if all fields are present
    // forEach can not break without exception, thus we have to check afterwards
    let incomplete = false;
    Object.values(valuesDict).forEach(function (value) {
        if (value === undefined) {
            incomplete = true;
        }
    });
    if (incomplete) {
        return helper.sendJsonResponse(res, 400, "Not all mandatory fields provided",
            "The following fields are mandatory: " + valuesDict.keys)
    }

    // Check if payeeId is really a payee
    if (!(await payee.isPayee(valuesDict['payeeId']))) {
        return helper.sendJsonResponse(res, 403, "Provided id for payee is no payee",
            "Please provide an id which corresponding user is a payee");
    }

    // Add creatorId
    valuesDict["creatorId"] = req.id;

    // Add optional
    valuesDict["additionalLocationInfo"] = req.body.additionalLocationInfo;

    models.Study.create(valuesDict)
        .then(res.status(200).send())
        .catch(error => helper.sendJsonResponse(res, 500, "Internal server error",
            env === 'development' ? error.message : "Request failed"));
};

module.exports = {
    get,
    post
};