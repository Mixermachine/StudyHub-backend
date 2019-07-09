"use strict";

const helper = require("./helper");
const env = process.env.NODE_ENV || 'development';

const generic = {
    get: (tblObj, req, res) => {
        const id = req.params.id;
        if (!id) {
            return helper.sendJsonResponse(res, 422, "Parameter id is missing",
                "Can not process query for missing field id");
        }
        generic.getX(tblObj, id).then(x => {
            if(x) {
                res.status(200).json(x);
            } else {
                helper.sendJsonResponse(res, 404, "Not found",
                    id + " is not a " + tblObj.name);
            }
        });
    },

    post: (tblObj, req, res) => {
        const id = req.body.id;
        if (!id) {
            return helper.sendJsonResponse(res, 422, "Parameter id is missing",
                "Can not process query for missing field id");
        }

        generic.isX(tblObj, id).then(result => {
            if (result) {
                return helper.sendJsonResponse(res, 409, "Is already " + tblObj.name,
                    id + " is already a " + tblObj.name);
            } else {
                generic.makeX(tblObj, id)
                    .then(() => {
                        helper.sendJsonResponse(res, 200, undefined,
                            "User " + id + " is now a " + tblObj.name)
                    })
                    .catch(error => helper.sendJsonResponse(res, 500, "Server error",
                        env === 'development' ? error.message : "Request failed"));
            }
        });
    },

    getX: (tblObj, userId) => {
        return tblObj.findByPk(userId);
    },

    isX: (tblObj, userId) => {
        return generic.getX(tblObj, userId)
            .then(user => {
                return user !== null
            });
    },

    makeX: (tblObj, userId) => {
        return tblObj.create({"userId": userId});
    }
};

module.exports = generic;