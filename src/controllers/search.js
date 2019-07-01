const models = require('../models');
const env = process.env.NODE_ENV || 'development';
const logger = require('./../logger');
const helper = require('./helper');

const search = async (req, res) => {

    // only searchText is mandatory, all other fields are optional
    const valuesDict = {
        searchText: req.body.searchText,
        location: req.body.location,
        organizer: req.body.organizer,
        minReward: req.body.minReward,
        rewardType: req.body.rewardType
    };

    const query = {};
    query['title'] = "{[Op.like]: ' " + valuesDict['searchText'] + "'}";

    models.Study.findAll({where: query})
        .then(result => {

            res.status(200).json(result)
        })
        .catch(error => helper.sendJsonResponse(res, 500, "Internal server error",
            env === 'development' ? error.message : "Request failed"));

};


module.exports = {
    search
};