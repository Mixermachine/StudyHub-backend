const models = require('../models');
const env = process.env.NODE_ENV || 'development';
const logger = require('./../logger');
const helper = require('./helper');
const Sequelize = require('sequelize');


//TODO: QR-code get secret (base url in config), and verify secret in timeslot
//TODO: get for study to receive participant ids with timeslot and  if he attended
//TODO: change to search/study
const search = async (req, res) => {

    // only searchText is mandatory, all other fields are optional
    const valuesDict = {
        searchText: req.body.searchText,
        location: req.body.location,    // zip or city
        organizer: req.body.organizer,  //TODO: add field to creator as char f,s,e
        minReward: req.body.minReward,  //TODO: study erweitern als double in € rewardCurrency, rewardAmount, rewardType
        rewardType: req.body.rewardType //TODO: study erweitern als char d,l,n
    };

    const Op = Sequelize.Op;

    const orWhere = [];
    orWhere.push({title: {[Op.iLike]:  "%" + valuesDict['searchText'] + "%"}}); // check title
    orWhere.push({description: {[Op.iLike]:  "%" + valuesDict['searchText'] + "%"}}); // check description
    orWhere.push({'$StudyKeywords.keyword$': {[Op.in]:  valuesDict['searchText'].split(' ')}}); // check keywords
    // TODO: Lowercase?


    const andWhere = {[Op.or]: orWhere}; // or
    //andWhere['title'] = {[Op.iLike]:  "%game%"}; // and this (e.g. reward > 5) // just a placeholder
    // check location
    // check organizer
    // check min reward
    // check reward type



    models.Study.findAll({autoQuoteAliasNames: false, where: andWhere, include: [models.StudyKeyword]})
        .then(result => {

            res.status(200).json(result)
        })
        .catch(error => helper.sendJsonResponse(res, 500, "Internal server error",
            env === 'development' ? error.message : "Request failed"));

};


module.exports = {
    search
};