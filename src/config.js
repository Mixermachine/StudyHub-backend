"use strict";
const config = require(__dirname + '/../config/config.json')[process.env.NODE_ENV || 'development'];

module.exports = {
    config
};