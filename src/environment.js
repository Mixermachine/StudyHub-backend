'use strict';

const devStr = 'development';

const value = process.env.NODE_ENV || devStr;

const isDev = () => value !== devStr;

const maskMsgIfNotDev = (msg) => isDev() ? msg : undefined;

module.exports = {
    value,
    isDev,
    maskMsgIfNotDev
};