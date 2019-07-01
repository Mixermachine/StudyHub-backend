"use strict";

const helper = require("./helper");
const env = process.env.NODE_ENV || 'development';

const getGeneric = (tblObj) => {
    generic.tableObj = tblObj;
    return generic;
};

const generic = {
    tableObj: undefined,
    get: (req, res) => {
        const id = req.params.id;
        if (!id) {
            return helper.sendJsonResponse(res, 422, "Parameter id is missing",
                "Can not process query for missing field id");
        }
        generic.getX(id).then(x => {
            if(x) {
                res.status(200).json(x);
            } else {
                helper.sendJsonResponse(res, 404, "Not found",
                    id + " is not a " + generic.tableObj.name);
            }
        });
    },

    post: (req, res) => {
        const id = req.body.id;
        if (!id) {
            return helper.sendJsonResponse(res, 422, "Parameter id is missing",
                "Can not process query for missing field id");
        }

        generic.isX(id).then(result => {
            if (result) {
                return helper.sendJsonResponse(res, 409, "Is already " + generic.tableObj.name,
                    id + " is already a " + generic.tableObj.name);
            } else {
                generic.makeX(id)
                    .then(() => {
                        helper.sendJsonResponse(res, 200, undefined,
                            "User " + id + " is now a " + generic.tableObj.name)
                    })
                    .catch(error => helper.sendJsonResponse(res, 500, "Server error",
                        env === 'development' ? error.message : "Request failed"));
            }
        });
    },

    getX: (userId) => {
        return generic.tableObj.findByPk(userId);
    },

    isX: (userId) => {
        return generic.getX(userId)
            .then(user => {
                return user !== null
            });
    },

    makeX: (userId) => {
        return generic.tableObj.create({"userId": userId});
    }
};

module.exports = {
    getGeneric
};