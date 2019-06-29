"use strict";

const models = require('../models');
const env = process.env.NODE_ENV || 'development';
const logger = require('./../logger');
const helper = require('./helper')

const get = (req, res) => {
    if (req.body.id == undefined) {
        helper.sendJsonResponse(res, 422, "Parameter id is missing", "Can't get details for a study without the id of the study");
    }

    models.User.findByPk(req.body.id, {
        attributes: ['description', 'prerequisites', 'capacity', 'country', 'city', 'zip', 'street', 'number', 'additionalLocationInfo', 'published']
        }).then(study => {
            if (!study || study.published == false) {
                return helper.sendJsonResponse(res, 404, "Not found", "Study with id " + str(req.body.id) + " was not found")
            }
            
            res.status(200).json(study);
    });
}

module.exports = {
    get
}