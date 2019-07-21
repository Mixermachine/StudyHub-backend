"use strict";

const generic = require('./genericUserExtension');
const models = require('../models');
const env = process.env.NODE_ENV || 'development';
const logger = require('./../logger')('payoutMethod');
const helper = require('./helper');

const create = async (req, res) => {
    let userId = req.params.userId;

    if (parseInt(userId) !== req.id) {
        return helper.sendJsonResponse(res, 401, "Unauthorized",
            "You can not access user data of other users");
    }

    if (Object.keys(req.body).length === 0) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body is empty'
    });

    // all fields (except participantId) are mandatory
    const valuesDict = {
        participantId: userId,
        rewardTypeId: req.body.rewardTypeId,
        paymentInfo: req.body.paymentInfo
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

    // Set date
    valuesDict['date'] = Date.now();

    // Add payout method into database
    models.PayoutMethod.create(valuesDict)
        .then(x => {
            if (x) {
                res.status(200).json({id: x.id});
            }
        })
        .catch(error => helper.sendJsonResponse(res, 500, "Internal server error",
            env === 'development' ? error.message : "Request failed"));

    logger.info("Created a new payout method for " + valuesDict['participantId']);
};

const get = async (req, res) => {
    let userId = req.params.userId;

    if (parseInt(userId) !== req.id) {
        return helper.sendJsonResponse(res, 401, "Unauthorized",
            "You can not access user data of other users");
    }

    let payoutMethodId = req.params.payoutMethodId;

    const attributes = ['id', 'rewardTypeId', 'participantId', 'paymentInfo', 'date'];

    let queryWhere = {raw: true, attributes: attributes};
    if (payoutMethodId !== undefined) {
        queryWhere['where'] = {participantId: userId, id: payoutMethodId};
    } else {
        queryWhere['where'] = {participantId: userId};
    }

    models.PayoutMethod.findAll(queryWhere).then(paymentMethod => {
        if (!paymentMethod) {
            return helper.sendJsonResponse(res, 404, "Not found",
                "Payout method with id " + payoutMethodId + " was not found")
        }

        res.status(200).json(paymentMethod);
    });
};

const put = async (req, res) => {
    const userId = req.params.userId;
    const payoutMethodId = req.params.payoutMethodId;

    if (parseInt(userId) !== req.id) {
        return helper.sendJsonResponse(res, 401, "Unauthorized",
            "You can not access user data of other users");
    }

    if (Object.keys(req.body).length === 0) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body is empty'
    });

    // all fields are optional but one must be specified
    const valuesDict = {
        rewardTypeId: req.body.rewardTypeId,
        paymentInfo: req.body.paymentInfo
    };

    // Set modifiedOn field
    valuesDict['date'] = Date.now();

    // build update
    Object.keys(valuesDict).forEach(key => {
        if (valuesDict[key] === undefined) {
            delete valuesDict[key];
        }
    });

    // update fields
    models.PayoutMethod.update(valuesDict, {where:{id:payoutMethodId, participantId:userId}})
        .then(res.status(200).send())
        .catch(error => helper.sendJsonResponse(res, 500, "Internal server error",
            env === 'development' ? error.message : "Request failed"));

    logger.info("Payout method for user with id " + userId + " updated");
};

module.exports = {
    create,
    get,
    put
};