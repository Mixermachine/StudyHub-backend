"use strict";

const sendJsonResponse = function (res, code, error, message) {
    if (error) {
        res.status(code).json({
            error: error,
            message: message
        });
    } else {
        res.status(code).json({
            message: message
        });
    }
};

module.exports = {
    sendJsonResponse
}