const generic = require('./genericUserExtension');
const models = require('../models');

const me = generic.getGeneric(models.Participant);

module.exports = {
    get: me.get,
    post: me.post,
    isParticipant: me.isX
};