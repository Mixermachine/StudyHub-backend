"use strict";


const models = require('../models');
const helper = require('./helper');
const env = require('../environment');
const jwt = require('jsonwebtoken');
const config = require('../config').config;
const participant = require('./participant');
const study = require('./study');
const notifier = require('../notifier');
const messageTemplate = require('../messageTemplateProvider');

const get = (req, res) => {
    const studyId = req.params.studyId;
    if (!studyId) {
        return helper.sendJsonResponse(res, 422, "Parameter studyId is missing",
            "Can't find timeslot without the studyId.");
    }

    const timeslotId = req.params.timeslotId;

    const attributes = ['id', 'start', 'stop', 'attended', 'studyId', 'participantId', 'payoutMethodId'];

    // get study first so we get the id of the study creator
    models.Study.findByPk(studyId)
        .then(study => {
            if (!study) {
                return helper.sendJsonResponse(res, 404, "Not found",
                    "Study " + studyId + " does not exist.");
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
    delete timeslot.payoutMethodId;
};

const post = (req, res) => {
    const studyId = req.params.studyId;
    if (!studyId) {
        return helper.sendJsonResponse(res, 422, "Parameter studyId is missing",
            "Can't post timeslot without the studyId.");
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
    timeslot.payoutMethodId = undefined;
    timeslot.studyId = studyId;
};

const put = async (req, res) => {
    const studyId = req.params.studyId;
    if (!studyId) {
        return helper.sendJsonResponse(res, 422, "Parameter studyId is missing",
            "Can't update timeslot without the studyId.");
    }

    const timeslotId = req.params.timeslotId;
    if (!timeslotId) {
        return helper.sendJsonResponse(res, 422, "Parameter timeslotId is missing",
            "Can't update timeslot without the timeslotId.");
    }

    study.getAvailableCapacity(studyId)
        .then(availableCapacity => {

            if (availableCapacity === null || availableCapacity === undefined) {
                return helper.sendJsonResponse(res, 404, "Study not found",
                    "The provided studyId does belong to no study");
            }

            if (!availableCapacity > 0) {
                return helper.sendJsonResponse(res, 405, "Not capacity available",
                    "The study available capacity of this study has been reached. " +
                    "New participant can only take part if the capacity is increased or other participants no longer participate");
            }

            // make it possible to delete participantId from timeslot
            if (req.body.participantId === '') {
                req.body.participantId = null;
            }


            models.Study.findByPk(studyId)
                .then(study => {
                    const timeslotUpdate = req.body;

                    // studyId should not be changed.
                    // This could be really bad (creators moving slots to another study so they don't have to pay)
                    if (timeslotUpdate.studyId !== undefined) {
                        return helper.sendJsonResponse(res, 403, "Forbidden",
                            "You can not change the studyId of a timeslot.")
                    }

                    // id should never be changed, as references could become invalid
                    if (timeslotUpdate.id !== undefined) {
                        return helper.sendJsonResponse(res, 403, "Forbidden",
                            "You can not change the id of a timeslot.")
                    }

                    // if public user check values first
                    if (study.creatorId !== req.id &&
                        (Object.keys(timeslotUpdate).length !== 2 || timeslotUpdate.participantId !== req.id)) {
                        return helper.sendJsonResponse(res, 401, "Unauthorized",
                            "If you are not the study creator your put should only contain the " +
                            "field participantId and payoutMethodId with your own id.");
                    }

                    study.getTimeslots({where: {id: timeslotId}})
                        .then(async timeslots => {
                            const timeslot = timeslots[0];

                            let previousParticipantId = null;

                            // check if participantId links to a participant
                            if (!(req.body.participantId === undefined || req.body.participantId === null)) {
                                let isParticipant = false;

                                // wait for query as we are in a if branch, we need to directly await result
                                await participant.isParticipant(req.body.participantId).then(result => {
                                    isParticipant = result;
                                });

                                // if is not return
                                if (!isParticipant) {
                                    return helper.sendJsonResponse(res, 404, "ParticipantId not found",
                                        "User with id " + req.body.participantId + " is not a participant.");
                                }

                                // if it is, save previous participant
                                previousParticipantId = timeslot.participantId;
                            }

                            // check if empty participantId is possible
                            if (timeslot.attended) {
                                return helper.sendJsonResponse(res, 403, "Forbidden",
                                    "This timeslot has already been attended." +
                                    "The participantId can't be changed after the timeslot has been attended.");
                            }

                            Object.assign(timeslot, timeslotUpdate);
                            timeslot.save()
                                .then(() => res.status(200).send());

                            // notify users
                            if (timeslot.participantId) {
                                notifier.notifyUserWithTemplate(timeslot.participantId,
                                    messageTemplate.studyHasBeenBooked({study: study, timeslot: timeslot}));
                            }

                            if (previousParticipantId) {
                                notifier.notifyUserWithTemplate(previousParticipantId,
                                    messageTemplate.studyHasBeenUnBooked({study: study, timeslot: timeslot}));
                            }


                        });
                })
                .catch(error =>
                    helper.sendJsonResponse(res, 500, "Internal server error",
                        env.maskMsgIfNotDev(error.message)));
        });


};

const generateSecretCheckin = (req, res) => {
    const studyId = req.params.studyId;
    const timeslotId = req.params.timeslotId;

    if (!studyId || !timeslotId) {
        return helper.sendJsonResponse(res, 422, "Parameter missing",
            "To generate secretCheckin both studyId and timeslotId are needed.");
    }

    models.Study.findByPk(studyId)
        .then((study) => {
            if (study) {
                if (study.creatorId !== req.id) {
                    return helper.sendJsonResponse(res, 401, "Unauthorized",
                        "Only the creator of the study can generate a secureCheckin.");
                }

                study.getTimeslots({where: {id: timeslotId}})
                    .then(timeslots => {
                        if (timeslots) {
                            if (timeslots[0].participantId === null) {
                                return helper.sendJsonResponse(res, 405, "Timeslot has no participant",
                                    "To generate secureCheckin the timeslot has to be assigned to a participant.");
                            }

                            if (timeslots[0].attended) {
                                return helper.sendJsonResponse(res, 405, "Timeslot has already been attended",
                                    "Student in timeslot has already attended the timeslot. " +
                                    "Can't create a secureCheckin for an already attended timeslot.");
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
            "To perform secretCheckin both studyId and timeslotId are needed.");
    }

    jwt.verify(req.params.token, config.jwtSecret, (err, decoded) => {
        if (err) {
            if (err.message === "jwt expired") {
                return helper.sendJsonResponse(res, 401, "Token expired",
                    "The token you provided could not be decrypted as it is expired.");
            } else {
                return helper.sendJsonResponse(res, 401, "Failed to decrypt token",
                    "The token you provided could not be decrypted.");
            }
        }

        if (studyId !== decoded.studyId || timeslotId !== decoded.timeslotId) {
            return helper.sendJsonResponse(res, 401, "Token did not match",
                "The encrypted ids in the token did not match the provided ids in the url.");
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
                                        .json({message: "Timeslot has been marked attended successfully."}));
                            }
                        });
                }
            })
            .catch(error => helper.sendJsonResponse(res, 500, 'Internal Server Error',
                env.maskMsgIfNotDev(error.message)));
    });
};

const getDurationOfTimeslotForStudy = (studyId) => {
    return models.Study.findByPk(studyId)
        .then(study => {
            if (study) {
                return study.getTimeslots()
                    .then(timeslots => {
                        if (timeslots.length > 0) {
                            return timeslots[0].stop - timeslots[0].start;
                        }
                    })
            }

            return 0;
        })
};

const getParticipantsOfStudiesOfCreator = (creatorId) => {
    return models.Study.findAll({where: {creatorId: creatorId}})
        .then(studies => {
            if (studies) {
                const promises = studies.map(study => study.getTimeslots());
                return Promise.all(promises);
            }

            return [];
        }).then(studiesTimeslots =>
            studiesTimeslots.flat().reduce((list, timeslot) => {
                if (timeslot.participantId) {
                    list.push(timeslot.participantId);
                }
                return list;
            }, []));
};


module.exports = {
    get,
    post,
    put,
    generateSecretCheckin,
    secretCheckin,
    getDurationOfTimeslotForStudy,
    getParticipantsOfStudiesOfCreator
};