const generic = require('./genericUserExtension');
const models = require('../models');

const me = generic.getGeneric(models.Payee);

module.exports = {
    get: me.get,
    post: me.post,
    isPayee: me.isX
};