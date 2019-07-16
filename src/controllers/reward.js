"use strict";

const generic = require('./genericUserExtension');
const models = require('../models');

const get = async (req, res) => {

    models.RewardType.findAll().then(rewards => {
        res.status(200).json(rewards);
    });
};

module.exports = {
    get
};