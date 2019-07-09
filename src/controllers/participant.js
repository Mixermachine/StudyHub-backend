"use strict";

const generic = require('./genericUserExtension');
const models = require('../models');

const tblObj = models.Participant;

const get = (req, res) => generic.get(tblObj, req, res);
const post = (req, res) => generic.post(tblObj, req, res);
const isParticipant = (id) => generic.isX(tblObj, id);

module.exports = {
    get,
    post,
    isParticipant
};