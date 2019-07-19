"use strict";

const models = require('../models');
const env = require('../environment');
const logger = require('./../logger');
const helper = require('./helper');
const creator = require('./creator');
const payee = require('./payee');
const timeslot = require('./timeslot');
const Sequelize = require('sequelize');

const get = (req, res) => {
    const studyId = req.params.studyId;
    if (studyId === undefined) {
        return helper.sendJsonResponse(res, 422, "Parameter id is missing",
            "Can't get details for a study without the id of the study");
    }

    models.Study.findByPk(studyId, {
        attributes: ['id', 'title', 'description', 'prerequisites', 'capacity', 'country', 'city', 'zip', 'street', 'number',
            'additionalLocationInfo', 'rewardCurrency', 'rewardAmount', 'published', 'creatorId', 'payeeId']
    }).then(study => {
        if (!study || !study.published) {
            return helper.sendJsonResponse(res, 404, "Not found",
                "Study with id " + studyId + " was not found")
        }

        // creator and payee should only be visible to these two
        if (!(req.auth && (req.id === study.creatorId || req.id === study.payeeId))) {
            study.creatorId = study.payeeId = "hidden";
        }

        addDurationAndCapacityAndReturn(res, study);
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
        rewardCurrency: req.body.rewardCurrency,
        rewardAmount: req.body.rewardAmount,
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
        .then(x => {
            if (x) {
                res.status(200).send({id: x.id});
            }
        })
        .catch(error => helper.sendJsonResponse(res, 500, "Internal server error",
            env.maskMsgIfNotDev(error.message)));
};

const put = async (req, res) => {
    const id = req.params.id;

    if (id === undefined) {
        return helper.sendJsonResponse(res, 422, "Parameter id is missing",
            "Can't find study without the id");
    }

    // check authentication
    await models.Study.findByPk(id).then(
        study => {
            if (!(req.auth && req.id === study.creatorId)) {
                return helper.sendJsonResponse(res, 401, "Authentication error",
                    "You must be logged as the study organizer to change the study data");
            }
        }
    );

    if (Object.keys(req.body).length === 0) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body is empty'
    });

    // all fields are optional but one must be specified
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
        additionalLocationInfo: req.body.additionalLocationInfo,
        rewardCurrency: req.body.rewardCurrency,
        rewardAmount: req.body.rewardAmount,
        published: req.body.published
    };

    // build update
    Object.keys(valuesDict).forEach(key => {
        if (valuesDict[key] === undefined) {
            delete valuesDict[key];
        }
    });

    // update fields
    models.Study.update(valuesDict, {where: {id: id}})
        .then(res.status(200).send())
        .catch(error => helper.sendJsonResponse(res, 500, "Internal server error",
            env.maskMsgIfNotDev(error.message)));

    logger.info("Study with id " + id + " updated");
};

const searchStudy = async (req, res) => {

    // all fields are optional
    const valuesDict = {
        searchText: req.query.searchText,
        city: req.query.city,
        zip: req.query.zip,
        organizer: req.query.organizer,
        minReward: req.query.minReward
    };

    const Op = Sequelize.Op;

    const orWhere = [];
    if (valuesDict['searchText'] === undefined) {
        valuesDict['searchText'] = '';
    }
    orWhere.push({title: {[Op.iLike]: "%" + valuesDict['searchText'] + "%"}}); // check title
    orWhere.push({description: {[Op.iLike]: "%" + valuesDict['searchText'] + "%"}}); // check description
    orWhere.push({'$StudyKeywords.keyword$': {[Op.in]: valuesDict['searchText'].toLowerCase().split(' ')}}); // check keywords, keywords must be saved lower case

    const andWhere = {[Op.or]: orWhere};
    andWhere['published'] = {[Op.eq]: 'true'};
    if (valuesDict['city'] !== undefined) {
        andWhere['city'] = {[Op.iLike]: "%" + valuesDict['city'] + "%"}; // check city
    }
    if (valuesDict['zip'] !== undefined) {
        andWhere['zip'] = {[Op.iLike]: valuesDict['zip']}; // check zip
    }
    if (valuesDict['organizer'] !== undefined) {
        andWhere['$Creator.organizerType$'] = {[Op.iLike]: valuesDict['organizer']}; // check organizer
    }
    if (valuesDict['minReward'] !== undefined) {
        andWhere['rewardAmount'] = {[Op.gte]: valuesDict['minReward']}; // check min reward
    }

    models.Study.findAll({
        where: andWhere,
        include: [{model: models.StudyKeyword, attributes: []}, {model: models.Creator, attributes: ['organizerType']}],
        attributes: ['id', 'title', 'description', 'prerequisites', 'capacity', 'country', 'city', 'zip', 'street',
            'number', 'additionalLocationInfo', 'rewardCurrency', 'rewardAmount']
    })
        .then(results => {
            if (results) {
                addDurationAndCapacityAndReturn(res, results);
            }
        })
        .catch(error => helper.sendJsonResponse(res, 500, "Internal server error",
            env.maskMsgIfNotDev(error.message)));

};

const getAvailableCapacity = (studyId) => {
    return models.Study.findByPk(studyId)
        .then(study => {
            if (study) {
                return study.getTimeslots()
                    .then(timeslots => {
                        if (timeslots) {
                            const taken = timeslots.reduce((sum, x) => sum + (x.participantId !== null ? 1 : 0), 0);

                            return study.capacity - taken
                        }
                        return null;
                    });
            }
            return null;
        });
};

const availableCapacity = (req, res) => {
    const studyId = req.params.studyId;

    if (!studyId) {
        return helper.sendJsonResponse(res, 422, "Parameter studyId is missing",
            "Can't get available capacity of study without studyId.");
    }

    getAvailableCapacity(studyId)
        .then(available => {
                if (available !== undefined && available !== null) { // 0 would evaluate to false
                    res.status(200).json({availableCapacity: available});
                }

                helper.sendJsonResponse(res, 404, "Study not found",
                    "The provided studyId does belong to no study");
            }
        )
        .catch(error => {
            helper.sendJsonResponse(res, 500, "Internal server error", env.maskMsgIfNotDev(error.message));
        })
};

const addDurationAndCapacityAndReturn = (res, studies) => {

// Add information for front end to result.
// Not 100% ideal but reduces backend calls by the front end from 1 + 3 * x to 1
// (x being the count of the result of the study search)
    const promises = [];

    if (studies instanceof Array) {
        studies.forEach(study => {
            addAvailableCapacity(study, promises);
        });

        studies.forEach(study => {
            addDuration(study, promises);
        });

    } else {
        addAvailableCapacity(studies, promises);
        addDuration(studies, promises);
    }

    Promise.all(promises)
        .then(() =>
            res.status(200).json(studies));
};

const addDuration = (study, promises) => {
    promises.push(timeslot.getDurationOfTimeslotForStudy(study.id)
        .then(result => {
            study.dataValues.timeslotDuration = result
        }));
}

const addAvailableCapacity = (study, promises) => {
    promises.push(getAvailableCapacity(study.id)
        .then(result => {
            study.dataValues.availableCapacity = result
        }));
}



module.exports = {
    get,
    post,
    put,
    searchStudy,
    getAvailableCapacity,
    availableCapacity,
    addDurationAndCapacityAndReturn
};