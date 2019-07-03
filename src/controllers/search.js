const models = require('../models');
const env = process.env.NODE_ENV || 'development';
const logger = require('./../logger');
const helper = require('./helper');
const Sequelize = require('sequelize');


const searchStudy = async (req, res) => {

    // only searchText is mandatory, all other fields are optional
    const valuesDict = {
        searchText: req.body.searchText,
        city: req.body.city,
        zip: req.body.zip,
        organizer: req.body.organizer,
        minReward: req.body.minReward,
        rewardType: req.body.rewardType
    };

    const Op = Sequelize.Op;

    const orWhere = [];
    orWhere.push({title: {[Op.iLike]: "%" + valuesDict['searchText'] + "%"}}); // check title
    orWhere.push({description: {[Op.iLike]: "%" + valuesDict['searchText'] + "%"}}); // check description
    orWhere.push({'$StudyKeywords.keyword$': {[Op.in]: valuesDict['searchText'].toLowerCase().split(' ')}}); // check keywords, keywords must be saved lower case

    const andWhere = {[Op.or]: orWhere};
    andWhere['published'] = {[Op.eq]: 'true'}
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
    if (valuesDict['rewardType'] !== undefined) {
        andWhere['rewardType'] = {[Op.iLike]: valuesDict['rewardType']}; // check reward type
    }

    models.Study.findAll({where: andWhere, include: [{model: models.StudyKeyword, attributes: []}, {model: models.Creator, attributes: ['organizerType']}],
        attributes: ['title', 'description', 'prerequisites', 'capacity', 'country', 'city', 'zip', 'street', 'number', 'additionalLocationInfo', 'rewardCurrency', 'rewardAmount', 'rewardType']})
        .then(result => {

            res.status(200).json(result)
        })
        .catch(error => helper.sendJsonResponse(res, 500, "Internal server error",
            env === 'development' ? error.message : "Request failed"));

};

module.exports = {
    searchStudy
};