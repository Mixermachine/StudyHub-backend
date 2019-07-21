const generic = require('./genericUserExtension');
const models = require('../models');
const env = process.env.NODE_ENV || 'development';
const logger = require('./../logger')('creator');
const helper = require('./helper');


const tblObj = models.Creator;

const get = (req, res) => generic.get(tblObj, req, res);
const isCreator = (id) => generic.isX(tblObj, id);

const post = async(req, res) => {
    const id = req.params.id;
    if (!id) {
        return helper.sendJsonResponse(res, 422, "Parameter id is missing",
            "Can not process query for missing field id");
    }

    if (req.body.organizerType === undefined) {
        return helper.sendJsonResponse(res, 422, "Organizer type is undefined",
            "You must specify the organizer type");
    }

    generic.isX(tblObj, id).then(result => {
        if (result) {
            return helper.sendJsonResponse(res, 409, "Is already " + tblObj.name,
                id + " is already a " + tblObj.name);
        } else {
            tblObj.create({"userId": id, "organizerType": req.body.organizerType})
                .then((x) => {
                    if (x) {
                        res.status(200).json({id: x.userId});
                    }
                })
                .catch(error => helper.sendJsonResponse(res, 500, "Server error",
                    env === 'development' ? error.message : "Request failed"));
        }
    });
};

module.exports = {
    get,
    post,
    isCreator
};