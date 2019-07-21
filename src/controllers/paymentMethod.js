'use strict';

const payee = require('./payee');
const helper = require('./helper');
const models = require('../models');
const logger = require('../logger')('paymentMethod');
const env = require('../environment');

const create = (req, res) => {
    let userId = req.params.userId;

    if (parseInt(userId) !== req.id) {
        return helper.sendJsonResponse(res, 401, "Unauthorized",
            "You can not access user data of other users");
    }

    if (Object.keys(req.body).length === 0) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body is empty'
    });

    // check if payee
    payee.isPayee(userId)
        .then(result => {
            if (result) {
                // all fields (except participantId) are mandatory
                const valuesDict = {
                    name: req.body.name,
                    kind: req.body.kind.toLowerCase(),
                    kindInfo: req.body.kindInfo,
                    payeeId: userId
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
                    return helper.sendJsonResponse(res, 400, "Malformed request",
                        "Not all fields provided");
                }

                if (!(valuesDict.kind === "paypal" || valuesDict.kind === 'creditcard')) {
                    return helper.sendJsonResponse(res, 400, "Malformed request",
                        "Field kind can only have the value creditcard or paypal");
                }

                const paymentMethodValues = {name: valuesDict.name, payeeId: valuesDict.payeeId};
                const kindValues = {info: valuesDict.kindInfo};

                models.PaymentMethod.create(paymentMethodValues)
                    .then(x => {
                        if (x) {
                            kindValues.paymentMethodId = x.id;

                            let promise = undefined;
                            if (valuesDict.kind === "paypal") {
                                promise = models.PaymentPayPal.create(kindValues)
                            } else if (valuesDict.kind === "creditcard") {
                                promise = models.PaymentCreditCard.create(kindValues);
                            } else {
                                throw "kind field was faulty. Val: " + valuesDict.kind;
                            }

                            return promise.then(y => {
                                if (y) {
                                    return res.status(200).json({id: x.id});
                                }
                            });
                        }
                    })
                    .catch(err => {
                        logger.errorWithUuid(req, err.message);
                        helper.sendJsonResponse(res, 500, "Internal server error",
                            env.maskMsgIfNotDev(err.message));

                    })
            } else {
                logger.infoWithUuid(req, "UserId not found or not a payee");
                return helper.sendJsonResponse(res, 404, "Not found",
                    "UserId was not found or is not a payee");
            }
        });
};

const get = (req, res) => {
    let userId = req.params.userId;

    if (parseInt(userId) !== req.id) {
        return helper.sendJsonResponse(res, 401, "Unauthorized",
            "You can not access user data of other users");
    }

    models.PaymentMethod.findAll({where: {payeeId: userId}})
        .then(async paymentMethods => {
            const promises = [];

            // sequelize does not like when nested objects are added to dataValues
            const outputMap = new Map();
            await paymentMethods.forEach(method => outputMap.set(method.id, method.toJSON()));

            paymentMethods.forEach(method => {

                promises.push(method.getPaymentCreditCard().then(cc => {
                    if (cc) {
                        outputMap.get(method.id).creditcard = cc;
                    }
                }));

                promises.push(method.getPaymentPayPal().then(pp => {
                    if (pp) {
                        outputMap.get(method.id).paypal = pp;
                    }
                }));
            });

            Promise.all(promises).then(() => {
                res.status(200).json(Array.from(outputMap.values()));
            });
        })
};

module.exports = {
    create,
    get
};