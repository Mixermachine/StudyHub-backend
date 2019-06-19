"use strict";

//Configuration variables
const port      = process.env.PORT        || '3000';
const JwtSecret = process.env.JWT_SECRET || 'very secret secret';

module.exports = {
    port,
    JwtSecret,
};