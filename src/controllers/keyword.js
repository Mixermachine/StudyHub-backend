"use strict";

const models = require('../models');
const helper = require('./helper');
const env = require('../environment');


const get = (req, res) => {
    const studyId = req.params.studyId;
    if (!studyId) {
        return helper.sendJsonResponse(res, 422, "Parameter studyId is missing",
            "Can't find keywords without the studyId.");
    }
    const attributes = ['studyId', 'keyword'];

    let queryWhere = {raw: true, attributes: attributes};
    queryWhere['where'] = {studyId: studyId};

    models.StudyKeyword.findAll(queryWhere).then(keywords => {
        res.status(200).json(keywords);
    });
};

const post = (req, res) => {
    const studyId = req.params.studyId;
    if (!studyId) {
        return helper.sendJsonResponse(res, 422, "Parameter studyId is missing",
            "Can't post keyword(s) without the studyId.");
    }

    // Return 400 and break if not all fields provided
    if (req.body.keywords === undefined) {
        helper.sendJsonResponse(res, 400, "Malformed request", "Not all fields provided");
        return;
    }

    // get study first so we get the id of the study creator
    models.Study.findByPk(studyId)
        .then(study => {
            if (!study) {
                return helper.sendJsonResponse(res, 404, "Not found",
                    "Study " + studyId + " does not exist.");
            }

            if (req.id !== study.creatorId) {
                return helper.sendJsonResponse(res, 401, "Unauthorized",
                    "If you are not the study creator cannot create a keyword for it.");
            }
        });

    const promises = [];
    req.body.keywords.map(keyword =>  {
        promises.push(keywordExists(studyId, keyword.keyword)
            .then(result => {
            if (!result) {
                keyword.studyId = studyId;
                return models.StudyKeyword.create(keyword);
            }
            return undefined;
        }));
    });

    Promise.all(promises)
        .then((list) => {
            let count = list.reduce((sum, obj) => sum + (obj !== undefined) ? 1: 0, 0);
            res.status(200).send({updated: count});
        })
        .catch(error => {
            return helper.sendJsonResponse(res, 500, "Internal server error",
                env.maskMsgIfNotDev(error.message));
        });
};

const keywordExists = (studyId, keyword) => {
    return models.StudyKeyword.count({where: {studyId: studyId, keyword: keyword}}).then(count => count >= 1);
};

const remove = async (req, res) => {
    const studyId = req.params.studyId;
    if (!studyId) {
        return helper.sendJsonResponse(res, 422, "Parameter studyId is missing",
            "Can't post timeslot without the studyId.");
    }

    const keyword = req.params.keyword;
    if (!keyword) {
        helper.sendJsonResponse(res, 400, "Malformed request", "Not all fields provided");
        return;
    }

    // get study first so we get the id of the study creator
    models.Study.findByPk(studyId)
        .then(study => {
            if (!study) {
                return helper.sendJsonResponse(res, 404, "Not found",
                    "Study " + studyId + " does not exist.");
            }

            if (req.id !== study.creatorId){
                return helper.sendJsonResponse(res, 401, "Unauthorized",
                    "If you are not the study creator cannot delete a keyword of the study.");
            }

            // Delete keyword from database
            models.StudyKeyword.destroy({where:{studyId: studyId, keyword: keyword}})
                .then(rowsDeleted => {
                    if (rowsDeleted >= 1) {
                        res.status(200).send();
                    } else {
                        return helper.sendJsonResponse(res, 404, "Not found",
                            "Not able to find the keyword.");
                    }
                })
                .catch(error => helper.sendJsonResponse(res, 500, "Internal server error",
                    env === 'development' ? error.message : "Request failed"));
        });
};

module.exports = {
    get,
    post,
    remove
}