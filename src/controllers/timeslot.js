"use strict";

const models = require('../models');
const helper = require('./helper');
const env = process.env.NODE_ENV || 'development';

const get = (req, res) => {
    const studyId = req.params.studyId;
    if (!studyId) {
        return helper.sendJsonResponse(res, 422, "Parameter studyId is missing",
            "Can't find timeslot without the studyId");
    }

    const timeslotId = req.params.timeslotId;

    const attributes = ['start', 'stop', 'attended', 'studyId', 'participantId'];

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
                        return res.code(200).json(timeslots[0]);
                    } else {
                        return res.code(200).json(timeslots);
                    }
                });
        });
    if (timeslotId) {
        models.timeslot.findOne({where: {id: timeslotId, studyId: studyId}, attributes: attributes})
            .then(timeslot => {
                if (!timeslot) {
                    return helper.sendJsonResponse(res, 404, "Not found",
                        "Study " + studyId + " has no timeslot with " + timeslotId);
                }

                res.status(200).json()
            });
    }
};

const removePersonalData = (timeslot) => {
    timeslot.taken = timeslot.studyId !== undefined;
    delete timeslot.studyId;
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
            return res.code(200).send();
        })
        .catch(err => {
            return helper.sendJsonResponse(res, 500, "Internal server error",
                env === "development" ? err.message : undefined)
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
            const timeslotUpdate = req.body.timeslot;

            // studyId should not be changed.
            // This could be really bad (creators moving slots to another study so they don't have to pay)
            if (timeslotUpdate.studyId !== undefined) {
                return helper.sendJsonResponse(res, 403, "Forbidden",
                    "You can not change the studyId of a timeslot")
            }

            // if public user check values first
            if (study.creatorId !== req.id &&
                !(timeslotUpdate.length !== 1 && timeslotUpdate.participantId !== req.id)) {
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
        .catch(err =>
            helper.sendJsonResponse(res, 500, "Internal server error",
                env === "development", err.message, undefined));
};

module.exports = {
    get,
    post,
    put
};