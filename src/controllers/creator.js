const generic = require('./genericUserExtension');
const models = require('../models');

const me = generic.getGeneric(models.Creator);

module.exports = {
    get: me.get,
    post: me.post,
    isCreator: me.isX
};