const config = require('./config').config['logger'];
const winston = require('winston');
const uuidv4 = require('uuid/v4');


const logger = winston.createLogger({
    level: config.logLevel,
    format: winston.format.json(),
    defaultMeta: {class: 'base'},
    transports: [
        //
        // - Write to all logs with level `info` and below to `combined.log`
        // - Write all logs error (and below) to `error.log`.
        //
        new winston.transports.File({filename: 'error.log', level: 'error'}),
        new winston.transports.File({filename: 'http.log', level: 'http'}),
        new winston.transports.File({filename: 'combined.log'}),
        new winston.transports.Console({format: winston.format.simple()})
    ]
});

const logRestCall = (req, res, next) => {
    req.uuid = uuidv4();
    logger.http(JSON.stringify({uuid: req.uuid, url: req.originalUrl}));

    next();
};

const wrapMessageWithUuid = (req, msg) => {
    return JSON.stringify({uuid: req.uuid, message: msg});
};

logger.logRestCall = logRestCall;

module.exports = logger;