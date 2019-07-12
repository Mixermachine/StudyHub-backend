"use strict";


const models = require('../models');
const helper = require('./helper');
const env = require('../environment');

const jwt = require('jsonwebtoken');
const config = require('../config').config;

const get = (req, res) => {
    const studyId = req.params.studyId;
    if (!studyId) {
        return helper.sendJsonResponse(res, 422, "Parameter studyId is missing",
            "Can't find timeslot without the studyId");
    }

    const timeslotId = req.params.timeslotId;

    const attributes = ['id', 'start', 'stop', 'attended', 'studyId', 'participantId'];

    // get study first so we get the id of the study creator
    models.Study.findByPk(studyId)
        .then(study => {
            if (!study) {
                return helper.sendJsonResponse(res, 404, "Not found",
                    "Study " + studyId + " does not exist");
            }

            let queryWhere = {raw: true, attributes: attributes};
            if (timeslotId) {
                queryWhere['where'] = {id: timeslotId}
            }

            study.getTimeslots(queryWhere)
                .then(timeslots => {
                    // remove private values if not user is not study creator
                    if (!(req.auth && study.creatorId === req.id)) {
                        timeslots.map(x => removePersonalData(x));
                    }

                    if (timeslotId) { // need to return single item not
                        return res.status(200).json(timeslots[0]);
                    } else {
                        return res.status(200).json(timeslots);
                    }
                });
        });
};

const removePersonalData = (timeslot) => {
    timeslot.reserved = timeslot.participantId !== null;
    delete timeslot.participantId;
};

const post = (req, res) => {
    const studyId = req.params.studyId;
    if (!studyId) {
        return helper.sendJsonResponse(res, 422, "Parameter studyId is missing",
            "Can't post timeslot without the studyId");
    }

    const promises = [];
    req.body.timeslots.map(timeslot => {
        // sanitize
        setStandardTimeslotValues(timeslot, studyId);

        promises.push(models.Timeslot.create(timeslot));
    });

    Promise.all(promises)
        .then((x) => {
            const ids = x.map(x => {
                return {id: x.id};
            });
            return res.status(200).send({ids: ids});
        })
        .catch(error => {
            return helper.sendJsonResponse(res, 500, "Internal server error",
                env.maskMsgIfNotDev(error.message));
        });
};

const setStandardTimeslotValues = (timeslot, studyId) => {
    timeslot.attended = false;
    timeslot.participantId = undefined;
    timeslot.studyId = studyId;
};

const put = (req, res) => {
    const studyId = req.params.studyId;
    if (!studyId) {
        return helper.sendJsonResponse(res, 422, "Parameter studyId is missing",
            "Can't update timeslot without the studyId");
    }

    const timeslotId = req.params.timeslotId;
    if (!timeslotId) {
        return helper.sendJsonResponse(res, 422, "Parameter timeslotId is missing",
            "Can't update timeslot without the timeslotId");
    }

    models.Study.findByPk(studyId)
        .then(study => {
            const timeslotUpdate = req.body;

            // studyId should not be changed.
            // This could be really bad (creators moving slots to another study so they don't have to pay)
            if (timeslotUpdate.studyId !== undefined) {
                return helper.sendJsonResponse(res, 403, "Forbidden",
                    "You can not change the studyId of a timeslot")
            }

            // id should never be changed, as references could become invalid
            if (timeslotUpdate.id !== undefined) {
                return helper.sendJsonResponse(res, 403, "Forbidden",
                    "You can not change the id of a timeslot")
            }

            // if public user check values first
            if (study.creatorId !== req.id &&
                (Object.keys(timeslotUpdate).length !== 1 || timeslotUpdate.participantId !== req.id)) {
                return helper.sendJsonResponse(res, 401, "Unauthorized",
                    "If you are not the study creator your put should only contain the " +
                    "field participantId with your own id");
            }

            study.getTimeslots({where: {id: timeslotId}})
                .then(timeslots => {
                    const timeslot = timeslots[0];
                    Object.assign(timeslot, timeslotUpdate);

                    timeslot.save()
                        .then(() => res.status(200).send())
                });
        })
        .catch(error =>
            helper.sendJsonResponse(res, 500, "Internal server error",
                env.maskMsgIfNotDev(error.message)));
};

const generateSecretCheckin = (req, res) => {
    const studyId = req.params.studyId;
    const timeslotId = req.params.timeslotId;

    if (!studyId || !timeslotId) {
        return helper.sendJsonResponse(res, 422, "Parameter missing",
            "To generate secretCheckin both studyId and timeslotId are needed");
    }

    models.Study.findByPk(studyId)
        .then((study) => {
            if (study) {
                if (study.creatorId !== req.id) {
                    return helper.sendJsonResponse(res, 401, "Unauthorized",
                        "Only the creator of the study can generate a secureCheckin");
                }

                study.getTimeslots({where: {id: timeslotId}})
                    .then(timeslots => {
                        if (timeslots) {
                            if (timeslots[0].participantId === null) {
                                return helper.sendJsonResponse(res, 405, "Timeslot has no participant",
                                    "To generate secureCheckin the timeslot has to be assigned to a participant");
                            }

                            if (timeslots[0].attended) {
                                return helper.sendJsonResponse(res, 405, "Timeslot has already been attended",
                                    "Student in timeslot has already attended the timeslot. " +
                                    "Can't create a secureCheckin for an already attended timeslot");
                            }

                            const token = jwt.sign({studyId: studyId, timeslotId: timeslotId}, config.jwtSecret, {
                                expiresIn: 20 // expires in 20 seconds
                            });

                            res.status(200).json({token: token});
                        }
                    })
            }
        })
        .catch(error => helper.sendJsonResponse(res, 500, 'Internal Server Error',
            env.maskMsgIfNotDev(error.message)));
};

const secretCheckin = (req, res) => {
    const studyId = req.params.studyId;
    const timeslotId = req.params.timeslotId;

    if (!studyId || !timeslotId) {
        return helper.sendJsonResponse(res, 422, "Parameter missing",
            "To perform secretCheckin both studyId and timeslotId are needed");
    }

    jwt.verify(req.params.token, config.jwtSecret, (err, decoded) => {
        if (err) {
            if (err.message === "jwt expired") {
                return helper.sendJsonResponse(res, 401, "Token expired",
                    "The token you provided could not be decrypted as it is expired");
            } else {
                return helper.sendJsonResponse(res, 401, "Failed to decrypt token",
                    "The token you provided could not be decrypted");
            }
        }

        if (studyId !== decoded.studyId || timeslotId !== decoded.timeslotId) {
            return helper.sendJsonResponse(res, 401, "Token did not match",
                "The encrypted ids in the token did not match the provided ids in the url");
        }

        models.Study.findByPk(studyId)
            .then((study) => {
                if (study) {
                    study.getTimeslots({where: {id: timeslotId}})
                        .then(timeslots => {
                            if (timeslots) {
                                timeslots[0].attended = true;
                                timeslots[0].save()
                                    .then(() => res.status(200)
                                        .json({message: "Timeslot has been marked attended successfully"}));
                            }
                        });
                }
            })
            .catch(error => helper.sendJsonResponse(res, 500, 'Internal Server Error',
                env.maskMsgIfNotDev(error.message)));
    });
};

module.exports = {
    get,
    post,
    put,
    generateSecretCheckin,
    secretCheckin
};